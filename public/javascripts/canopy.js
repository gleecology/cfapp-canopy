
CloudFlare.define( 'canopy', [      'canopy/config',   'cloudflare/jquery1.7' ],
                        function(   cfg,               jQuery ){ 
    var  appName = 'canopy',
        $       = jQuery;

    cfg         = cfg || {};
    cfg.crid    =  cfg.publisher_id ||  '537005147';    // pub id
    cfg.cid     =  cfg.cid || '8CUR5F7GW';              // adtype 
    cfg.size    = '641x481';

    $(document).ready( function(){
        var sct = document.createElement("script"),
        sctHl = document.getElementsByTagName("script")[0];
        sct.type = "text/javascript";
        sct.src = 'http://contextual.media.net/inslmedianet.js?cid=' + cfg.cid + '&crid=' + cfg.crid + '&size=' + cfg.size;
        sct.async = "async";
        sctHl.parentNode.insertBefore(sct, sctHl)
    });
} );
