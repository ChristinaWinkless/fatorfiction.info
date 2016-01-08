<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Sweets extends MY_Controller {

    /**
     * Sweets home controller
     */
    public function index()
    {
        $jsAssets = $this->config->item('js_sweets');
        $this->add_js($jsAssets);

        $this->load->model('sweets_model');
        $sweetsModelData = $this->sweets_model->get_data('data/pages/sweets/sweets.xml', 'data/pages/sweets/sweet-hotspots.json');
        
        $this->set('sweetData', $sweetsModelData);
        $this->render('desktop/sweets/index');
    }
}

/* End of file sweets.php */
/* Location: ./application/controllers/sweets.php */