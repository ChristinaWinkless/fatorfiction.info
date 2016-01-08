<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class ChocolateModel extends CI_Model { 

    function __construct(){

        parent::__construct();
    }

    /**
     * Load and return the pie chart data
     * @param string $xmlFile
     * @param string $jsonHotspots
     * @return object $chocolateModelData
     */
    function get_data($xmlFile, $jsonHotspots){

        $xml = simplexml_load_file(APPPATH.$xmlFile);

        $chocolateModelData = array();
        $chocolateBarObjs = array();
        $i = 0;
        foreach ($xml->bars as $bars) {
            foreach ($bars as $bar => $value) {
                $obj['name'] = (string) $value->attributes()->name;
                $obj['slug'] = strtolower(str_replace(' ', '-', $obj['name']));
                $obj['image'] = (string) $value->image->attributes()->url;
                $obj['image_width'] = (int) $value->image->attributes()->width;
                $obj['image_height'] = (int) $value->image->attributes()->height;
                $information['nameLine1'] = (string) $value->information->name->attributes()->line1;
                $information['nameLine2'] = (string) $value->information->name->attributes()->line2;
                $information['fat'] = (float) $value->information->fat;
                $information['calories'] = (int) $value->information->calories;
                $information['carbs'] = (float) $value->information->carbs;
                $information['protein'] = (float) $value->information->protein;
                $obj['information'] = (object) $information;
                $chocolateBarObjs[$i] = (object) $obj;
                $i++;
            }
        }

        $hotspots = file_get_contents(APPPATH.$jsonHotspots);

        $chocolateModelData['all_chocolate_bars_image'] = (string) $xml->all->attributes()->image;
        $chocolateModelData['chocolate_bars'] = $chocolateBarObjs;
        $chocolateModelData['hotspots'] = json_encode(json_decode($hotspots));

        return (object) $chocolateModelData;
    }
}

/* End of file chocolateModel.php */
/* Location: ./application/models/chocolateModel.php */