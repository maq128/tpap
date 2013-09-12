<?php
// 根据访问路径确定适配器名称，用于生成 html / js 文件
$baseName = basename( strtolower($_SERVER['SCRIPT_NAME']), '.php' );

// 启用缓存，为了收集所生成的 html 内容
ob_start();
?><!doctype html>
<html>
<head>
<meta charset="utf-8">
<title></title>
<script type="text/javascript" src="http://a.tbcdn.cn/s/kissy/1.3.0/kissy-min.js"></script>
<script type="text/javascript" src="http://a.tbcdn.cn/apps/taesite/balcony/core/r3002/caja/caja-min.js"></script>

<script type="text/javascript" src="../../assets/base/caja-util.js"></script>
<script type="text/javascript" src="../../assets/base/caja-log.js"></script>
<script type="text/javascript" src="../../assets/base/balcony.js"></script>
<script type="text/javascript" src="../../assets/openjs/kissy/1.3.0/adaptor.js"></script>
<script src="../../test/assets.js"></script>
</head>
<body>

<!--
    需要测试的dom结构，注意，最外层<div class="J_TScriptedModule" data-componentid="uniqueSign"> 的class和为属性不可修改
    用户的javascript理论上只可以作用到这个dom下面，不可以"越界"
-->

<div id="dom-test" data-componentid="uniqueSign" class="J_TScriptedModule">
