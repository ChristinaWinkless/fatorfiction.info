<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class PieChartModel extends CI_Model { 

    function __construct(){

        parent::__construct();
    }

    /**
     * Load and return the pie chart data
     * @param string $xmlFile
     * @param string $jsonSegments
     * @return object $pieModelData
     */
    function get_data($xmlFile, $jsonSegments){

        $xml = simplexml_load_file(APPPATH.$xmlFile);

        $pieModelData = array();
        $pieObjs = array();
        $i = 0;
        foreach ($xml->segments as $segments) {
            foreach ($segments as $segment => $value) {
                $obj['name'] = (string) $value->attributes()->name;
                $obj['slug'] = strtolower(str_replace(' ', '-', $obj['name']));
                $information['nameLine1'] = (string) $value->information->name->attributes()->line1;
                $information['nameLine2'] = (string) $value->information->name->attributes()->line2;
                $information['slice'] = (string) $value->information->slice->attributes()->url;
                $information['fat'] = (float) $value->information->fat;
                $information['calories'] = (int) $value->information->calories;
                $information['carbs'] = (float) $value->information->carbs;
                $information['protein'] = (float) $value->information->protein;
                $information['percent'] = (int) $value->information->percent;
                $obj['information'] = (object) $information;
                $pieObjs[$i] = (object) $obj;
                $i++;
            }
        }

        $segmentsJson = file_get_contents(APPPATH.$jsonSegments);

        $pieModelData['type'] = (string) $xml->chart->attributes()->type;
        $pieModelData['chart_image'] = (string) $xml->chart->attributes()->image;
        $pieModelData['radius'] = (int) $xml->chart->attributes()->radius;
        $pieModelData['slice'] = (string) $xml->chart->attributes()->slice;
        $pieModelData['segments'] = $pieObjs;
        $pieModelData['segments_coords'] = json_encode(json_decode($segmentsJson));

        return (object) $pieModelData;
    }
}

/* End of file PieChartModel.php */
/* Location: ./application/models/PieChartModel.php */