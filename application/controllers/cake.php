<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cake extends MY_Controller {

	/**
	 * Alcohol home controller
	 */
	public function index()
	{
        $jsAssets = $this->config->item('js_cake');
        $this->add_js($jsAssets);

        $this->load->model('piechart_model');
        $pieModelData = $this->piechart_model->get_data('data/pages/cake/cake.xml', 'data/pages/cake/cake-segments.json');

        $this->set('pieData', $pieModelData);
		$this->render('desktop/charts/pie');
	}
}

/* End of file cake.php */
/* Location: ./application/controllers/cake.php */