<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MetaModel extends CI_Model { 

    function __construct(){

        parent::__construct();
    }

    /**
     * Load the meta data
     * @return $menu
     */
    function get_meta_data(){

        $xml = simplexml_load_file(APPPATH."data/global/meta.xml");
        $meta = array();
        
        $keywords = '';
        $i = 0;
        $length = count($xml->meta->keywords->children());
        foreach ($xml->meta->keywords->children() as $value) {    

            $seperator = ($i === $length-1) ? $seperator = '' : $seperator = ', ';
            $keywords .= (string) $value . $seperator;

            $i++;
        }
        
        $meta['description'] = (string) $xml->meta->description;
        $meta['keywords'] = $keywords;

        return (object) $meta;
    }
}

/* End of file metaModel.php */
/* Location: ./application/models/metaModel.php */