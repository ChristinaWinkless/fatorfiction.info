<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Chocolate extends MY_Controller {

    /**
     * Chocolate home controller
     */
    public function index()
    {
        $jsAssets = $this->config->item('js_chocolate');
        $this->add_js($jsAssets);

        $this->load->model('chocolate_model');
        $chocolateModelData = $this->chocolate_model->get_data('data/pages/chocolate/chocolate.xml', 'data/pages/chocolate/chocolate-hotspots.json');
        
        $this->set('chocolateData', $chocolateModelData);
        $this->render('desktop/chocolate/index');
    }
}

/* End of file chocolate.php */
/* Location: ./application/controllers/chocolate.php */