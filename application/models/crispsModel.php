<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class CrispsModel extends CI_Model { 

    function __construct(){

        parent::__construct();
    }

    /**
     * Load and return the crisps data
     * @param string $xmlFile
     * @param string $jsonHotspots
     * @return object $crispsModelData
     */
    function get_data($xmlFile, $jsonHotspots){

        $xml = simplexml_load_file(APPPATH.$xmlFile);

        $crispsModelData = array();
        $crispPacketObjs = array();
        $i = 0;
        foreach ($xml->crisps as $crisps) {
            foreach ($crisps as $packet => $value) {
                $obj['name'] = (string) $value->attributes()->name;
                $obj['slug'] = strtolower(str_replace(' ', '-', $obj['name']));
                $obj['image_rollover'] = (string) $value->images->attributes()->rollover;
                $obj['image_large'] = (string) $value->images->attributes()->large;
                $obj['image_width'] = (int) $value->images->attributes()->width;
                $obj['image_height'] = (int) $value->images->attributes()->height;
                $information['nameLine1'] = (string) $value->information->name->attributes()->line1;
                $information['nameLine2'] = (string) $value->information->name->attributes()->line2;
                $information['fat'] = (float) $value->information->fat;
                $information['calories'] = (int) $value->information->calories;
                $information['carbs'] = (float) $value->information->carbs;
                $information['protein'] = (float) $value->information->protein;
                $obj['information'] = (object) $information;
                $crispPacketObjs[$i] = (object) $obj;
                $i++;
            }
        }

        $hotspots = file_get_contents(APPPATH.$jsonHotspots);

        $crispsModelData['navigation_image'] = (string) $xml->navigation->attributes()->image;
        $crispsModelData['crisps'] = $crispPacketObjs;
        $crispsModelData['hotspots'] = json_encode(json_decode($hotspots));

        return (object) $crispsModelData;
    }
}

/* End of file chocolateModel.php */
/* Location: ./application/models/chocolateModel.php */