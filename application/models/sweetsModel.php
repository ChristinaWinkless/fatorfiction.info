<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class SweetsModel extends CI_Model { 

    function __construct(){

        parent::__construct();
    }

    /**
     * Load and return the pie chart data
     * @param string $xmlFile
     * @param string $jsonHotspots
     * @return object $sweetsModelData
     */
    function get_data($xmlFile, $jsonHotspots){

        $xml = simplexml_load_file(APPPATH.$xmlFile);

        $sweetsModelData = array();
        $sweetObjs = array();
        $i = 0;
        foreach ($xml->sweets as $sweets) {
            foreach ($sweets as $sweet => $value) {
                $obj['name'] = (string) $value->attributes()->name;
                $obj['slug'] = strtolower(str_replace(' ', '-', $obj['name']));
                $obj['animated'] = (string) $value->attributes()->animated;
                $obj['image'] = (string) $value->image->attributes()->spritesheet;
                $obj['steps'] = (int) $value->image->attributes()->steps;
                $information['nameLine1'] = (string) $value->information->name->attributes()->line1;
                $information['nameLine2'] = (string) $value->information->name->attributes()->line2;
                $information['sugar'] = (float) $value->information->sugar;
                $information['fat'] = (float) $value->information->fat;
                $information['calories'] = (int) $value->information->calories;
                $information['carbs'] = (float) $value->information->carbs;
                $obj['information'] = (object) $information;
                $sweetObjs[$i] = (object) $obj;
                $i++;
            }
        }

        $hotspots = file_get_contents(APPPATH.$jsonHotspots);

        $sweetsModelData['all_graph_image'] = (string) $xml->graph->attributes()->image;
        $sweetsModelData['sweets'] = $sweetObjs;
        $sweetsModelData['hotspots'] = json_encode(json_decode($hotspots));

        return (object) $sweetsModelData;
    }
}

/* End of file sweetsModel.php */
/* Location: ./application/models/sweetsModel.php */