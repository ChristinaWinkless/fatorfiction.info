<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MenuModel extends CI_Model { 

    function __construct(){

        parent::__construct();
    }

    /**
     * Load the menu and get the items
     * @return $menu
     */
    function get_menu_items(){

        $xml = simplexml_load_file(APPPATH."data/global/menu.xml");

        $items = array();
        $i = 0;
        foreach ($xml->children() as $menuItem) {
            foreach ($menuItem as $item => $value) {
                
                $obj['name'] = (string) $value->attributes()->name;
                $obj['class'] = (string) $value->attributes()->class;
                $obj['url'] = (string) $value->attributes()->url;                
           
                $items[$i] = (object) $obj;
                $i++;
           }           
        }

        return $items;
    }
}

/* End of file menuModel.php */
/* Location: ./application/models/menuModel.php */