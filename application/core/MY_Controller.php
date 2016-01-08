<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class MY_Controller extends CI_Controller {

    /**
     * The data array for view
     */
    var $data = array();

    /**
     * JS files for the view
     */
    var $jsAssets = array();



    function __contruct() {

        parent::__contruct();
    }

    /**
     * Add data to the view
     * @return $key
     * @return $value
     */
    function set($key, $value){
        $this->data[$key] = $value;  
    }

    /**
     * Add data to the view
     * @return $key
     * @return $value
     */
    function add_js($array){
        $this->jsAssets = array_merge($this->jsAssets, $array);
    }

    /**
     * Render the view
     * @param $view
     */
    function render($view){

        // Load helpers
        $this->load->helper('url');     
        $this->load->library('user_agent');

        // Load libraries
        $this->load->library('carabiner'); 

        $carabiner_config = array(
            'script_dir' => 'assets/js/', 
            'style_dir'  => 'assets/css/',
            'cache_dir'  => 'assets/cache/',
            'base_uri'   => base_url(),
            'combine'    => TRUE,
            'dev'        => $this->config->item('dev_mode')
        );
        $this->carabiner->config($carabiner_config);
        $this->carabiner->empty_cache('css', 'yesterday'); 
        $this->carabiner->empty_cache('js', 'yesterday'); 

        // Load Models
        $this->load->model('menu_model');
        $this->load->model('meta_model');

        // Data for view
        $this->set('title', $this->build_title());
        $this->set('meta', $this->meta_model->get_meta_data());
        $this->set('food_type', $this->food_category_type());
        $this->set('menu', $this->build_menu());
        $this->set('google_analytics_key', $this->config->item('google_analytics_key'));
        $this->set('pageUrl', $this->get_page_url());
        $this->set('browser_version', $this->agent->browser() . ' '. $this->agent->version());

        // Assets for view
        $this->carabiner->css(base_url().'assets/css/site.css');
        $this->carabiner->js($this->config->item('js_global'));
        if(count($this->jsAssets) > 0)
            $this->carabiner->js($this->jsAssets);


        // Check Browser
        $platform = $this->get_platform();

        if (strcmp($platform, 'mobile') == 0) {

            $this->set('platform', 'mobile');
            $this->load->view('mobile/home/index', $this->data);

        } else {

            if(strcmp($platform, 'ipad') == 0){
                $this->set('platform', 'ipad');
            } else {
                $this->set('platform', 'desktop');
            }

            $this->load->view('shared/_header', $this->data);
            $this->load->view($view, $this->data);
            $this->load->view('shared/_footer', $this->data);
        }
    }

    /**
     * Build the menu
     * @return $menu
     */
    function build_menu(){
        
        $items = $this->menu_model->get_menu_items();

        $menu = '';
        $active = '';

        foreach ($items as $item => $value) {

            $name = $items[$item]->name; 
            $class = $items[$item]->class;
            $url = $items[$item]->url;

            if(strcmp($this->food_category_type(), strtolower($name)) == 0){
                $active .= 'active';
            }

            $menu .= '<li><a class="' . $class . ' ' . $active . '" href="' . $url . '" title="' . $name . '">' . $name . '</a></li>'."\n";
            $active = '';
        }

        return $menu;
    }

    /**
     * Build the page title
     * @return $title
     */
    function build_title(){

        $title = 'Fat or Fiction ';

        $length = count($this->uri->segments);
        if($length > 0){

            foreach ($this->uri->segments as $segment):

                $title .= ' - ' . ucwords($segment);
                
            endforeach;
        } 

        return $title;
    }

    /**
     * Get the food category type from the 1st uri segment
     * @return $type
     */
    function food_category_type(){
        return $this->uri->segment(1);
    }

    /**
     * Get the platform type
     * @return $platform
     */
    function get_platform(){

        $platform = '';

        if ($this->agent->is_mobile()) {
            
            $is_ipad = (bool) strpos($_SERVER['HTTP_USER_AGENT'],'iPad'); 

            $platform = ($is_ipad) ? $platform = 'ipad' : $platform = 'mobile';
      
        } else {
            
            $platform = 'desktop';
        }

        return $platform;
    }

    /**
     * Get the full page url
     * @return $pageUrl
     */
    function get_page_url(){

        $pageURL = (@$_SERVER["HTTPS"] == "on") ? "https://" : "http://";
        
        if ($_SERVER["SERVER_PORT"] != "80")
        {
            $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
        } 
        else 
        {
            $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
        }

        return $pageURL;
    }
}

/* End of file MY_Controller.php */
/* Location: ./application/core/MY_Controller.php */