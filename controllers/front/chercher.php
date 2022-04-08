<?php

class MacaveChercherModuleFrontController extends ModuleFrontController
{
    public $auth = true;
    public $ssl = true;

    public function initContent()
    {
        $this->assignGeneralPurposeVariables();
        $this->context->link->getModuleLink('ma cave', 'chercher');
        $this->setTemplate('module:macave/views/templates/front/macave.tpl');
    }
}
