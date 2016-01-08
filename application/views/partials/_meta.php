    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title><?=$title?></title>
    <meta name="description" content="<?=$meta->description?>">
    <meta name="keywords" content="<?=$meta->keywords?>">
    <meta name="author" content="David Paul Rosser">

    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0" />

    <?php $this->carabiner->display('css') ?>

    <script src="<?=base_url()?>assets/js/libs/modernizr-2.5.3.min.js"></script>
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script>window.jQuery || document.write('<script src="<?=base_url()?>assets/js/libs/jquery-1.7.2.min.js"><\/script>')</script>

    <link rel="shortcut icon" href="<?=base_url()?>assets/images/global/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="<?=base_url()?>assets/images/global/apple-touch-icon-144x144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?=base_url()?>assets/images/global/apple-touch-icon-114x114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?=base_url()?>assets/images/global/apple-touch-icon-72x72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="<?=base_url()?>assets/images/global/apple-touch-icon-precomposed.png">