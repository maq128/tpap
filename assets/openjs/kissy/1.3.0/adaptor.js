/**
 * @fileOverview ���������ɹ��ߡ�
 */
KISSY.makeAdaptor = function( def ) {
	var me = KISSY.makeAdaptor;
	KISSY.add(function ( S, Ctor ) {
		return function( frameGroup ) {
			/**
			 * @param context ������
			 * @param context.mod ɳ���ģ�鷶Χ�����в��������޶���ģ�鷶Χ֮��ȥִ��
			 * @param context.frame ����ģ���ɳ��
			 * @return {Object} ʵ�ʵ��������
			 */
			return function ( context ) {
				// ���������� constructor
				var Adaptee = def.adaptee || Ctor;

				// �������� contructor
				// Note: ֻ֧�� new ��ʽ��������֧�� function call �ķ�ʽ��
				var Adaptor = function() {
					// �Դ���������б�����Ԥ����
					var args = me.safeArgsGuestToHost( arguments, def.args, this, context );

					// �ô�����Ĳ������� adaptee ����
					var inst;
					if ( Object.create ) {
						inst = Object.create( Adaptee.prototype );
					} else {
						inst = KISSY.clone( {} );
						inst.__proto__ = Adaptee.prototype;
					}
					var ret = Adaptee.apply( inst, args );
					var adaptee = Object(ret) === ret ? ret : inst;

					// ����ʵ��֮��������ϵ
					me.adaptTo( this, adaptee );
				};
				frameGroup.markCtor( Adaptor );

				// �����������Ĵ��� property
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
								// ���this �� Adaptor ʵ��
								var ret = this._ADAPTEE_[ real_prop ];
								return ret;
							};
						})());
						if ( type.writable ) {
							// setter
							Adaptor.prototype.__defineSetter__( property, (function( property ) {
								return function( val ) {
									// ���this �� Adaptor ʵ��
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

				// �������������������壬���������ȫ������ property
				for ( var property in def.properties ) {
					CreateSafeProperty( property );
				}

				// �����������Ĵ��� method
				var CreateSafeMethod = function( method ) {
					Adaptor.prototype[ method ] = function() {
						// ���this �� Adaptor ʵ��

						// �Դ���������б�����Ԥ����
						var args = me.safeArgsGuestToHost( arguments, def.methods[ method ], this, context );

						// ���ö�Ӧ�����ʵ������
						var ret = this._ADAPTEE_[ method ].apply( this._ADAPTEE_, args );

						// �ѷ���ֵת�����ʺϷ��ظ� guest code ��ֵ
						ret = me.safeValueHostToGuest( ret, context );

						// TODO: �����Ƿ���Ҫ���� def �е�ĳ�����öԷ���ֵ������
						// Note: ����� ret �������������δ�� mark �ģ���������

						return ret;
					};
					frameGroup.grantMethod( Adaptor, method );
				};

				// �������������������壬���������ȫ������ method
				for ( var method in def.methods ) {
					CreateSafeMethod( method );
				}

				// event handler ����ӿ�
				Adaptor.prototype[ 'on' ] = function( name, guestCallback, scope ) {
					// ���this �� Adaptor ʵ��

					// ����Ƿ�Ϊ�ж���� event
					var props = def.events[ name ];
					if ( ! props || ! KISSY.isArray(props) ) {
						throw new Error('event "' + name + '" not defined properly.');
					}

					// ���ö�Ӧ�����ʵ���� on()
					var ret = this._ADAPTEE_.on( name, function( e ) {
						// TODO: ���� props �б��� event ����ش��� guest code
						var event = {};
						for ( var i = 0; i < props.length; i ++ ) {
							var prop = props[i];
							event[ prop ] = me.safeValueHostToGuest( e[ prop ], context );
						}

						// ����Ͳ��öԷ���ֵ�����������ˣ���Ϊ������� host code ����ʲô��в
						return guestCallback.call( scope || this, event );
					});

					// �ѷ���ֵת�����ʺϷ��ظ� guest code ��ֵ
					ret = me.safeValueHostToGuest( ret, context );

					return ret;
				};
				frameGroup.grantMethod( Adaptor, 'on' );

				// �����������ľ�̬���� method
				var CreateSafeStaticMethod = function( Ctor, method ) {
					Ctor[ method ] = frameGroup.markFunction( function() {
						// ���this �� ������
						// whatever��������������

						// �Դ���������б�����Ԥ����
						var args = me.safeArgsGuestToHost( arguments, def.static_methods[ method ], null, context );

						// ���ö�Ӧ�������̬����
						var ret = Adaptee[ method ].apply( null, args );

						// �ѷ���ֵת�����ʺϷ��ظ� guest code ��ֵ
						ret = me.safeValueHostToGuest( ret, context );

						return ret;
					});
					frameGroup.grantRead( Ctor, method );
				};

				// �������������������壬���������ȫ����̬���� method
				for ( var method in def.static_methods ) {
					CreateSafeStaticMethod( Adaptor, method );
				}

				// ��������֮��������ϵ
				me.adaptTo( Adaptor, Adaptee );

				// �ڱ�¶�� caja ��ʱ������� HybridAdaptor ���� Adaptor��
				// ������ͬʱ֧�� new �� function call �Ĺ�����ʽ
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

// ����������ͶԲ������е����ݶ�����б�����Ԥ�����Դ��ݸ�������������
// Note: �˴��������Ȼ������ guest code�����ڴ�Խ taming boundary ���� host
// code ֮���Ѿ�������ѱ�����󣬶��Ǳ�ת���ɶ�Ӧ��Ұ�������ˡ�
KISSY.makeAdaptor.safeOneArgGuestToHost = function( origArg, type, adaptor, context ) {
	var safeArg;

	// ���ԭֵ���������������滻�ɶ�Ӧ���ѱ��������
	if ( KISSY.isObject(origArg) && origArg._ADAPTEE_ ) {
		origArg = origArg._ADAPTEE_;
	}

	if ( type === 'simple' ) {

		safeArg = origArg;

	} else if ( type === 'selector' ) {

		// �� context �� selector �ķ�Χ����Լ��
		safeArg = KISSY.makeAdaptor.restrictNodes( origArg, context );

	} else if ( type === 'callback' ) {

		// ��򵥴ֱ��Ļص�����ת�����������Ա��������Ļص�����ֱ�Ӵ��ݸ�ԭ�ص�������
		// Note: ���ڡ�ԭ�ص������������� guest code �� tamed function�����Դ����������
		// �������ڴ�Խ taming boundary ��ʱ���Զ�ת��Ϊ��Ӧ��ѱ��������������漰��
		// δ�� mark �������ͣ���ᶪʧ������ CustomEventObject��
		safeArg = (function( guestCallback ) {
			return function() {
				guestCallback.apply( adaptor, arguments );
			};
		})( origArg );

	} else if ( typeof type === 'function' ) {

		// ����� type ��һ�� factory function����������һ�����лزα������ܵĻص�����
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

	// ���ԭֵ���ѱ�����������滻������������
	if ( KISSY.isObject(origValue) && origValue._ADAPTOR_ ) {
		ret = origValue._ADAPTOR_;
	}

	// ���ԭֵ�����ѱ�������󣬵�������Ϊ�������䡱���򴴽�һ����������������
	else if ( KISSY.isObject(origValue) && origValue.constructor && origValue.constructor._ADAPTOR_ ) {
		// ���� KISSY.NodeList ����Ҫ���䷶ΧԼ����ģ���ڲ�
		if ( origValue instanceof KISSY.NodeList ) {
			origValue = new KISSY.NodeList.all( origValue, context.mod );
		}

		var adaptor = new origValue.constructor._ADAPTOR_;
		this.adaptTo( adaptor, origValue );
		ret = adaptor;
	}

	// DOM ������Ҫ�ر�� tame
	else if ( typeof ret == 'object' && ! ret._ADAPTEE_ && ret instanceof Node ) {
		ret = context.frame.imports.tameNode___( ret, true );
		// TODO: ��Ҫ��һ��Լ���䷶Χ
	}

	// TODO: Array ��Ҫ��һ������

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
