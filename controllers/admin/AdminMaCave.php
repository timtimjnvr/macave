<?php

class AdminExportCommandesController extends ModuleAdminController
{
    public function __construct()
    {
        $this->module = 'exportCommandes';
        $this->bootstrap = true;
        $this->context = Context::getContext();
        //The following 2 lines are useful if you have to link your controller to a certain table for data grids
        $this->table = 'contribution';
        $this->className = 'Contribution';

        parent::__construct();
    }
}
