<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Alcohol extends MY_Controller {

    /**
     * Alcohol home controller
     */
    public function index()
    {
        $jsAssets = $this->config->item('js_alcohol');
        $this->add_js($jsAssets);

        $this->load->model('alcohol_model');
        $alcoholModelData = $this->alcohol_model->get_data('data/pages/alcohol/alcohol.xml', 'data/pages/alcohol/alcohol-hotspots.json', 'data/pages/alcohol/alcohol-states.json');

        $this->set('alcoholData', $alcoholModelData);
        $this->render('desktop/alcohol/index');
    }
}

/* End of file alcohol.php */
/* Location: ./application/controllers/alcohol.php */