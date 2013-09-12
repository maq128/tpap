<?php include '../common/caja_head.php'; ?>

<!-- 模块初始化的包配置 -->
<script type="text/javascript">
    KISSY.config(
        {
            debug: true,
            packages: [
                {
                    name: "openjs", //包名
                    tag: "20130527",//时间戳, 添加在动态脚本路径后面, 用于更新包内模块代码
                    path: "../../assets", //包对应路径, 相对路径指相对于当前页面路径    //
                    charset: "utf-8" //包里模块文件编码格式
                }
            ]
        }
    );
    cajaConfig = {//配置下你需要引入的模块名称，最后会被use到
        modules: "openjs/kissy/1.3.0/nodelist"
    }
</script>

<div class="top-authbtn-container top-login-btn-container"></div>
<a>test1</a>
<a>test2</a>
<input type="text" value="landao" class="inputcls">
<div class="dom-father">
	I'm father.
	<div class="dom-child1">I'm child 1.</div>
	<div class="dom-child2">I'm child 2.</div>
</div>
<div class="kissy-dom">
	<input class="inp1" name="inp1_na" type="text"/>
	<input class="inp2" name="inp2_na" type="checkbox"/>
</div>
<div class="select-dom">
	<label>
		<select class='selt'>
			<option value='one'>1</option>
			<option selected>2</option>
		</select>
	</label>
</div>
<div class="inner">1111</div>
<div class="rep-father">
	<div class="rep-child1"></div>
	<div class="rep-child2"></div>
</div>

<?php include '../common/caja_foot.php'; ?>
