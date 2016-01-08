<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class About extends MY_Controller {

	/**
	 * About controller
	 */
	public function index()
	{
        $this->load->model('about_model');
        $aboutModelData = $this->about_model->get_data('data/pages/about/about.xml');

        $this->set('aboutData', $aboutModelData);
		$this->render('desktop/about/index');
	}

}

/* End of file about.php */
/* Location: ./application/controllers/home/about.php */