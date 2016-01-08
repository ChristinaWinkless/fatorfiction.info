<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Global Config
 */
switch($_SERVER['HTTP_HOST']){

    /**
     * Development
     */
    case 'fatorfiction.dev':

        // Google Analytics key
        $config['google_analytics_key'] = 'UA-XXXXX-X';

        // Dev mode
        $config['dev_mode'] = TRUE;

    break;

    /**
     * Production
     */
    case 'fatorfiction.davidpaulrosser.co.uk':

        // Google Analytics key
        $config['google_analytics_key'] = 'UA-XXXXX-X';

        // Dev mode
        $config['dev_mode'] = TRUE;

    break;

    /**
     * Live
     */
    case 'fatorfiction.info':
    case 'www.fatorfiction.info':

        // Google Analytics key
        $config['google_analytics_key'] = 'UA-31956226-1';

        // Dev mode
        $config['dev_mode'] = FALSE;

    break;
}

