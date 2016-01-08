<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Alcohol_Model extends CI_Model { 

    function __construct(){

        parent::__construct();
    }

    /**
     * Load and return the alcohol data
     * @param string $xmlFile
     * @param string $jsonHotspots
     * @param string $jsonStates
     * @return object $alcoholModelData
     */
    function get_data($xmlFile, $jsonHotspots, $jsonStates){

        $xml = simplexml_load_file(APPPATH.$xmlFile);

        $alcoholModelData = array();
        $drinkObjs = array();
        $i = 0;
        foreach ($xml->drinks as $drinks) {
            foreach ($drinks as $drink => $value) {
                $obj['name'] = (string) $value->attributes()->name;
                $obj['slug'] = strtolower(str_replace(' ', '-', $obj['name']));
                $obj['slug'] = str_replace('&', 'and', $obj['slug']);
                $obj['image'] = (string) $value->image->attributes()->url;
                $information['nameLine1'] = (string) $value->information->name->attributes()->line1;
                $information['nameLine2'] = (string) $value->information->name->attributes()->line2;
                $information['units'] = (float) $value->information->units;
                $information['fat'] = (float) $value->information->fat;
                $information['calories'] = (int) $value->information->calories;
                $information['carbs'] = (float) $value->information->carbs;
                $information['protein'] = (float) $value->information->protein;
                $information['sugar'] = (int) $value->information->sugar;
                $obj['information'] = (object) $information;
                $drinkObjs[$i] = (object) $obj;
                $i++;
            }
        }

        $hotspots = file_get_contents(APPPATH.$jsonHotspots);
        $viewStates = file_get_contents(APPPATH.$jsonStates);
        
        $alcoholModelData['all_drinks_image'] = (string) $xml->all->attributes()->image;
        $alcoholModelData['drinks'] = $drinkObjs;
        $alcoholModelData['view_states'] = json_encode(json_decode($viewStates));
        $alcoholModelData['hotspots'] = json_encode(json_decode($hotspots));
        
        return (object) $alcoholModelData;
    }
}

/* End of file alcoholModel.php */
/* Location: ./application/models/alcoholModel.php */