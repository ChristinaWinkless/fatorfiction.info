<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Global JS 
 */
$config['js_global'] = array(

    array('log.js'),
    array('fatorfiction/app.js'),
);

/**
 * Module specific
 */ 

/**
 * Cake
 */
$config['js_cake'] = array(

    array('libs/paperjs/paper.js'),
    array('fatorfiction/utils/orientation-helper.js'),
    array('fatorfiction/page/pie-chart.js'),
);

/**
 * Alcohol
 */
$config['js_alcohol'] = array(

    array('libs/jquery.jswipe.js'),
    array('libs/paperjs/paper.js'),
    array('fatorfiction/utils/state-manager.js'),
    array('fatorfiction/utils/orientation-helper.js'),
    array('fatorfiction/page/alcohol.js'),
);

/**
 * Chocolate
 */
$config['js_chocolate'] = array(

    array('libs/paperjs/paper.js'),
    array('fatorfiction/utils/orientation-helper.js'),
    array('fatorfiction/page/chocolate.js'),
);

/**
 * Crisps
 */
$config['js_crisps'] = array(

    array('libs/paperjs/paper.js'),
    array('fatorfiction/utils/orientation-helper.js'),
    array('fatorfiction/page/crisps.js'),
);

/**
 * Cheese
 */
$config['js_cheese'] = array(

    array('libs/paperjs/paper.js'),
    array('fatorfiction/utils/orientation-helper.js'),
    array('fatorfiction/page/pie-chart.js'),
);

/**
 * Cheese
 */
$config['js_sweets'] = array(

    array('libs/paperjs/paper.js'),
    array('fatorfiction/utils/spritesheet-animator.js'),
    array('fatorfiction/utils/orientation-helper.js'),
    array('fatorfiction/page/sweets.js'),
);



/* End of file js_groups.php */
/* Location: ./application/config/js_groups.php */