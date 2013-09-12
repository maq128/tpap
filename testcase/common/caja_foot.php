</div><!-- J_TScriptedModule -->

<!--这里是将自己的js让服务端编译一下，配置下服务端的php路径和自己的js即可，注意路径-->
<?php
// 对指定的 js 文件进行 caja compile，保存编译结果，并返回保存的文件名
function cajaCompile( $origJsFile )
{
	$cajaJsFile = $origJsFile . '.cajaed.js';
	$origJsContent = file_get_contents( $origJsFile );

	$data = array(
		'token=TAE-SDK',
		'content=' . urlencode( $origJsContent ),
		'component=uniqueSign'
	);
	$data = implode( '&', $data );

    $curl = curl_init( 'http://zxn.taobao.com/tbcajaService.htm' );
    curl_setopt( $curl, CURLOPT_SSL_VERIFYHOST, 1 );
    curl_setopt( $curl, CURLOPT_SSL_VERIFYPEER, false );
    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt( $curl, CURLOPT_POST, 1 );
    curl_setopt( $curl, CURLOPT_POSTFIELDS, $data );
    $res = curl_exec( $curl );

    if ( ! curl_errno( $curl ) ) {
		$res = substr( $res, strpos( $res, 'TShop' ) );
		$res = str_replace( '&#39;', "'", $res );
		$res = str_replace( '&quot;','"', $res );
		$res = str_replace( '&amp;', '&', $res );
		$res = str_replace( "\\\\\"", "\\\"", $res );
        file_put_contents( $cajaJsFile, $res );
    }
    curl_close( $curl );
    return $cajaJsFile;
}

if ( isset($_GET['native']) ) {
	echo '<script src="' . $baseName . '.js"></script>';
} else {
	echo '<script type="text/javascript" src="' . cajaCompile( $baseName . '.js' ) . '"></script>';
	echo '<script src="../../assets/base/setup.js"></script>';
}
?>
</body>
</html>
<?php
$html = ob_get_contents();
file_put_contents( $baseName . '.html', $html );
ob_end_flush();
