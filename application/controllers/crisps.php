<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Crisps extends MY_Controller {

    /**
     * Crisps controller
     */
    public function index()
    {
        $jsAssets = $this->config->item('js_crisps');
        $this->add_js($jsAssets);

        $this->load->model('crisps_model');
        $crispsModelData = $this->crisps_model->get_data('data/pages/crisps/crisps.xml', 'data/pages/crisps/crisps-hotspots.json');

        $this->set('crispsData', $crispsModelData);
        $this->render('desktop/crisps/index');
    }
}

/* End of file Crisps.php */
/* Location: ./application/controllers/Crisps.php */