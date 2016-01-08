<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Error extends MY_Controller {


    /**
     * 404 page
     */
    public function error_404()
    {
        if(strcmp($this->uri->segment(1), 'error') != 0){
            header('location: /error/404');
        }

        $this->render('desktop/error/404');
    }

    /**
     * Unsupported browser page
     */
    public function unsupported()
    {
        $this->render('desktop/error/unsupported');
    }
}

/* End of file errors.php */
/* Location: ./application/controllers/error.php */