<?php
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
