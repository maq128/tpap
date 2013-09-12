</div><!-- J_TScriptedModule -->

<?php
// 对指定的 js 文件进行 caja compile，保存编译结果，并返回保存的文件名
function cajaCompile( $origJsFile )
{
	// 保持编译结果的文件名
	$cajaJsFile = $origJsFile . '.cajaed.js';

	// 编译服务的请求参数
	$origJsContent = file_get_contents( $origJsFile );
	$data = array(
		'token=TAE-SDK',
		'content=' . urlencode( $origJsContent ),
		'component=uniqueSign'
	);
	$data = implode( '&', $data );

	// 请求编译
    $curl = curl_init( 'http://zxn.taobao.com/tbcajaService.htm' );
    curl_setopt( $curl, CURLOPT_SSL_VERIFYHOST, 1 );
    curl_setopt( $curl, CURLOPT_SSL_VERIFYPEER, false );
    curl_setopt( $curl, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt( $curl, CURLOPT_POST, 1 );
    curl_setopt( $curl, CURLOPT_POSTFIELDS, $data );
    $res = curl_exec( $curl );

    if ( ! curl_errno( $curl ) ) {
		// 对编译结果进行清洗、提取
		$res = substr( $res, strpos( $res, 'TShop' ) );
		$res = str_replace( '&#39;', "'", $res );
		$res = str_replace( '&quot;','"', $res );
		$res = str_replace( '&amp;', '&', $res );
		$res = str_replace( "\\\\\"", "\\\"", $res );

		// 抹除 cajoledDate 印记，以避免每次无谓地把编译结果提交到 git
		$res = preg_replace( '/(\'cajoledDate\':) (\\d+)/', '\\1 0', $res );

		// 保存编译结果
        file_put_contents( $cajaJsFile, $res );
    }
    curl_close( $curl );
    return $cajaJsFile;
}

// 如果 url 里面带上 native 参数，则跳过 caja，直接使用原生组件，便于对比测试。
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
