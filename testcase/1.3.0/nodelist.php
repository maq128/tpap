<!doctype html>
<html>
<head>
<meta charset="gbk">
<title></title>
<script type="text/javascript" src="http://a.tbcdn.cn/s/kissy/1.3.0/kissy-min.js"></script>
<script type="text/javascript" src="http://a.tbcdn.cn/apps/taesite/balcony/core/r3002/caja/caja-min.js"></script>

<script type="text/javascript" src="../../assets/base/caja-util.js"></script>
<script type="text/javascript" src="../../assets/base/caja-log.js"></script>
<script type="text/javascript" src="../../assets/base/balcony.js"></script>
<script src="../../test/assets.js"></script>
</head>
<body>

<script type="text/javascript" src="../../assets/openjs/kissy/1.3.0/adaptor.js"></script>

<!--
    ��Ҫ���Ե�dom�ṹ��ע�⣬�����<div class="J_TScriptedModule" data-componentid="uniqueSign"> ��class��Ϊ���Բ����޸�
    �û���javascript������ֻ�������õ����dom���棬������"Խ��"
-->

<div id="dom-test" data-componentid="uniqueSign" class="J_TScriptedModule">
    <div class="top-authbtn-container top-login-btn-container"></div>
    <!--    <div id="mapDiv" style="width:800px;height:600px"></div>-->
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

    <!--    <input type="text" class="J_Calendar" name="sdfu7"/>-->
    <!---->
    <!--    <input type="text" id="J_AucTitle" name="item-title" value="����">-->
    <!--    <div id="J_LimiterWrapper"></div>-->
</div>

<!--ģ���ʼ���İ����ã�������Ϥ��-->
<script type="text/javascript">
    KISSY.config(
        {
            debug: true,
            packages: [
                {
                    name: "openjs", //����
                    tag: "20130527",//ʱ���, ����ڶ�̬�ű�·������, ���ڸ��°���ģ�����
                    path: "../../assets", //����Ӧ·��, ���·��ָ����ڵ�ǰҳ��·��    //
                    charset: "utf-8" //����ģ���ļ������ʽ
                }
            ]
        }
    );
    cajaConfig = {//����������Ҫ�����ģ�����ƣ����ᱻuse��
        modules: "openjs/kissy/1.3.0/nodelist"
    }

</script>

<!--�����ǽ��Լ���js�÷���˱���һ�£������·���˵�php·�����Լ���js���ɣ�ע��·��-->
<?
switch ('caja') {
case 'caja':
	require_once '../common/caja_compile.php';
	echo '<script type="text/javascript" src="'. cajaCompile('nodelist.js') .'"></script>';
	echo '<script src="../../assets/base/setup.js"></script>';
	break;
case 'native':
	echo '<script src="nodelist.js"></script>';
	break;
}
?>
</body>
</html>