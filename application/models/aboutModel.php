<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class AboutModel extends CI_Model { 

    function __construct(){

        parent::__construct();
    }

    /**
     * Load and return the about data
     * @param string $xmlFile
     */
    function get_data($xmlFile){

        $xml = simplexml_load_file(APPPATH.$xmlFile);

        $aboutModelData = array();

        $backgrounds = array();
        $i = 0;
        foreach ($xml->about->images as $images) {
            foreach ($images as $image => $value) {
                $obj['image'] = (string) $value->attributes()->url;
                $backgrounds[$i] = (object) $obj;
                $i++;
            }
        }

        $randomBackground = $backgrounds[rand(0, (count($backgrounds)-1))];
        $aboutModelData['background'] = $randomBackground;

        return (object) $aboutModelData;
    }
}

/* End of file aboutModel.php */
/* Location: ./application/models/aboutModel.php */