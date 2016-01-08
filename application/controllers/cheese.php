<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cheese extends MY_Controller {

    /**
     * Cheese controller
     */
    public function index()
    {
        $jsAssets = $this->config->item('js_cheese');
        $this->add_js($jsAssets);

        $this->load->model('piechart_model');
        $pieModelData = $this->piechart_model->get_data('data/pages/cheese/cheese.xml', 'data/pages/cheese/cheese-segments.json');

        $this->set('pieData', $pieModelData);
        $this->render('desktop/charts/pie');
    }
}

/* End of file cheese.php */
/* Location: ./application/controllers/cheese.php */