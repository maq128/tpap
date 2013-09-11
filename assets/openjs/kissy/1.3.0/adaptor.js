/**
 * @fileOverview 适配器生成工具。
 */
KISSY.makeAdaptor = function( def ) {
	var me = KISSY.makeAdaptor;
	KISSY.add(function ( S, Ctor ) {
		return function( frameGroup ) {
			/**
			 * @param context 上下文
			 * @param context.mod 沙箱的模块范围，所有操作必须限定到模块范围之内去执行
			 * @param context.frame 单个模块的沙箱
			 * @return {Object} 实际的组件对象
			 */
			return function ( context ) {
				// 被适配的组件 constructor
				var Adaptee = def.adaptee || Ctor;

				// 适配器的 contructor
				// Note: 只支持 new 方式构建，不支持 function call 的方式。
				var Adaptor = function() {
					// 对传入参数进行保护性预处理
					var args = me.safeArgsGuestToHost( arguments, def.args, this, context );

					// 用处理过的参数构建 adaptee 对象
					var inst;
					if ( Object.create ) {
						inst = Object.create( Adaptee.prototype );
					} else {
						inst = KISSY.clone( {} );
						inst.__proto__ = Adaptee.prototype;
					}
					var ret = Adaptee.apply( inst, args );
					var adaptee = Object(ret) === ret ? ret : inst;

					// 建立实例之间的适配关系
					me.adaptTo( this, adaptee );
				};
				frameGroup.markCtor( Adaptor );

				// 生成适配器的代理 property
				var CreateSafeProperty = function( property ) {
					var type = def.properties[ property ];
					var real_prop = type.alias_of || property;

					// Object.defineProperty or __defineGetter__ ?
					if ( Object.defineProperty ) {
						var accessors = { };
						accessors['get'] = function() {
							var val = this._ADAPTEE_[ real_prop ];
							return val;
						};
						if ( type.writable ) {
							accessors['set'] = function( val ) {
								this._ADAPTEE_[ real_prop ] = val;
								return val;
							};
						}
						Object.defineProperty( Adaptor.prototype, property, accessors );
					} else {
						// getter
						Adaptor.prototype.__defineGetter__( property, (function( property ) {
							return function() {
								// 这里，this 是 Adaptor 实例
								var ret = this._ADAPTEE_[ real_prop ];
								return ret;
							};
						})());
						if ( type.writable ) {
							// setter
							Adaptor.prototype.__defineSetter__( property, (function( property ) {
								return function( val ) {
									// 这里，this 是 Adaptor 实例
									this._ADAPTEE_[ real_prop ] = val;
									return val;
								};
							})());
							frameGroup.grantReadWrite( Adaptor.prototype, property );
						} else {
							frameGroup.grantRead( Adaptor.prototype, property );
						}
					}

					if ( type.writable ) {
						frameGroup.grantReadWrite( Adaptor.prototype, property );
					} else {
						frameGroup.grantRead( Adaptor.prototype, property );
					}
				};

				// 根据适配器的描述定义，生成所需的全部代理 property
				for ( var property in def.properties ) {
					CreateSafeProperty( property );
				}

				// 生成适配器的代理 method
				var CreateSafeMethod = function( method ) {
					Adaptor.prototype[ method ] = function() {
						// 这里，this 是 Adaptor 实例

						// 对传入参数进行保护性预处理
						var args = me.safeArgsGuestToHost( arguments, def.methods[ method ], this, context );

						// 调用对应的组件实例方法
						var ret = this._ADAPTEE_[ method ].apply( this._ADAPTEE_, args );

						// 把返回值转换成适合返回给 guest code 的值
						ret = me.safeValueHostToGuest( ret, context );

						// TODO: 考虑是否需要根据 def 中的某种配置对返回值做处理
						// Note: 这里的 ret 对象类型如果是未经 mark 的，该怎样？

						return ret;
					};
					frameGroup.grantMethod( Adaptor, method );
				};

				// 根据适配器的描述定义，生成所需的全部代理 method
				for ( var method in def.methods ) {
					CreateSafeMethod( method );
				}

				// event handler 适配接口
				Adaptor.prototype[ 'on' ] = function( name, guestCallback, scope ) {
					// 这里，this 是 Adaptor 实例

					// 检查是否为有定义的 event
					var props = def.events[ name ];
					if ( ! props || ! KISSY.isArray(props) ) {
						throw new Error('event "' + name + '" not defined properly.');
					}

					// 调用对应的组件实例的 on()
					var ret = this._ADAPTEE_.on( name, function( e ) {
						// TODO: 根据 props 列表构建 event 对象回传给 guest code
						var event = {};
						for ( var i = 0; i < props.length; i ++ ) {
							var prop = props[i];
							event[ prop ] = me.safeValueHostToGuest( e[ prop ], context );
						}

						// 这里就不用对返回值做保护处理了，因为它不会对 host code 产生什么威胁
						return guestCallback.call( scope || this, event );
					});

					// 把返回值转换成适合返回给 guest code 的值
					ret = me.safeValueHostToGuest( ret, context );

					return ret;
				};
				frameGroup.grantMethod( Adaptor, 'on' );

				// 生成适配器的静态代理 method
				var CreateSafeStaticMethod = function( Ctor, method ) {
					Ctor[ method ] = frameGroup.markFunction( function() {
						// 这里，this 是 ……？
						// whatever，反正不用它。

						// 对传入参数进行保护性预处理
						var args = me.safeArgsGuestToHost( arguments, def.static_methods[ method ], null, context );

						// 调用对应的组件静态方法
						var ret = Adaptee[ method ].apply( null, args );

						// 把返回值转换成适合返回给 guest code 的值
						ret = me.safeValueHostToGuest( ret, context );

						return ret;
					});
					frameGroup.grantRead( Ctor, method );
				};

				// 根据适配器的描述定义，生成所需的全部静态代理 method
				for ( var method in def.static_methods ) {
					CreateSafeStaticMethod( Adaptor, method );
				}

				// 建立类型之间的适配关系
				me.adaptTo( Adaptor, Adaptee );

				// 在暴露给 caja 的时候，用这个 HybridAdaptor 代替 Adaptor，
				// 即可以同时支持 new 和 function call 的构建方式
				var HybridAdaptor = frameGroup.markFunction( function( a1, a2, a3 ) {
					return new Adaptor( a1, a2, a3 );
				});
				for ( var method in def.static_methods ) {
					CreateSafeStaticMethod( HybridAdaptor, method );
				}

				var expose = {};
				expose[ def.ctor ] = HybridAdaptor.TAMED_TWIN___;
				return expose;
			}
		};
	}, {
		requires: def.requires
	});
};

// 按定义的类型对参数表中的数据对象进行保护性预处理，以传递给被适配的组件。
// Note: 此处的入参虽然来自于 guest code，但在穿越 taming boundary 进入 host
// code 之后，已经不再是驯化对象，而是被转换成对应的野化对象了。
KISSY.makeAdaptor.safeOneArgGuestToHost = function( origArg, type, adaptor, context ) {
	var safeArg;

	// 如果原值是适配器对象，则替换成对应的已被适配对象
	if ( KISSY.isObject(origArg) && origArg._ADAPTEE_ ) {
		origArg = origArg._ADAPTEE_;
	}

	if ( type === 'simple' ) {

		safeArg = origArg;

	} else if ( type === 'selector' ) {

		// 用 context 对 selector 的范围进行约束
		safeArg = KISSY.makeAdaptor.restrictNodes( origArg, context );

	} else if ( type === 'callback' ) {

		// 最简单粗暴的回调函数转换处理：把来自被适配对象的回调参数直接传递给原回调函数。
		// Note: 由于“原回调函数”来自于 guest code 的 tamed function，所以传给它的入口
		// 参数会在穿越 taming boundary 的时候被自动转换为对应的驯化对象，其中如果涉及到
		// 未经 mark 过的类型，则会丢失，比如 CustomEventObject。
		safeArg = (function( guestCallback ) {
			return function() {
				guestCallback.apply( adaptor, arguments );
			};
		})( origArg );

	} else if ( typeof type === 'function' ) {

		// 这里的 type 是一个 factory function，用于生成一个具有回参保护功能的回调函数
		safeArg = type( origArg, adaptor );

	} else {
		throw new Error('Unrecognized type.');
	}
	return safeArg;
};

KISSY.makeAdaptor.safeArgsGuestToHost = function( origArgs, types, adaptor, context ) {
	var safeArgs = [];
	for ( var i = 0; i < types.length; i ++ ) {
		var type = types[ i ];
		safeArgs[i] = KISSY.makeAdaptor.safeOneArgGuestToHost( origArgs[i], type, adaptor, context );
	}
	return safeArgs;
};

KISSY.makeAdaptor.safeValueHostToGuest = function( origValue, context ) {
	var ret = origValue;

	// 如果原值是已被适配对象，则替换成适配器本身
	if ( KISSY.isObject(origValue) && origValue._ADAPTOR_ ) {
		ret = origValue._ADAPTOR_;
	}

	// 如果原值不是已被适配对象，但其类型为“可适配”，则创建一个适配器来代理它
	else if ( KISSY.isObject(origValue) && origValue.constructor && origValue.constructor._ADAPTOR_ ) {
		// 对于 KISSY.NodeList 对象，要将其范围约束到模块内部
		if ( origValue instanceof KISSY.NodeList ) {
			origValue = new KISSY.NodeList.all( origValue, context.mod );
		}

		var adaptor = new origValue.constructor._ADAPTOR_;
		this.adaptTo( adaptor, origValue );
		ret = adaptor;
	}

	// DOM 对象需要特别的 tame
	else if ( typeof ret == 'object' && ! ret._ADAPTEE_ && ret instanceof Node ) {
		ret = context.frame.imports.tameNode___( ret, true );
		// TODO: 需要进一步约束其范围
	}

	// TODO: Array 需要进一步处理

	return ret;
};

KISSY.makeAdaptor.adaptTo = function( adaptor, adaptee ) {
	adaptor._ADAPTEE_ = adaptee;
	adaptee._ADAPTOR_ = adaptor;
};

KISSY.makeAdaptor.restrictNodes = function( s, context ) {
	var query = function( s, root ) {
		var ret = [];
		if ( root ) {
			root = query( root );
		} else {
			root = [];
		}

		if ( KISSY.isString( s ) ) {
			ret = KISSY.query( s, root[0] || context.mod );
		} else {
			ret = KISSY.query( s );
		}

		return ret;
	};
	return query( s );
};
