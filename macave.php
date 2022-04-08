<?php

if (!defined('_PS_VERSION_'))
    exit();

class MaCave extends Module
{
    public function __construct()
    {
        $this->name = 'macave';
        $this->tab = 'front_office_features';
        $this->version = '1.0.0';
        $this->author = 'Timothee Janvier';
        $this->need_instance = 0;
        $this->ps_versions_compliancy = [
            'min' => '1.7',
            'max' => _PS_VERSION_,
        ];
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('Ma cave');
        $this->description = $this->l('Gestion de la cave de l utilisateur');

        $this->confirmUninstall = $this->l('Are you sure you want to uninstall?');

        if (!Configuration::get('MYMODULE_NAME')) {
            $this->warning = $this->l('No name provided');
        }
    }

    public function install()
    {
        return parent::install();
    }

    public function getContent()
    {
        $request_nombre_clients = 'SELECT COUNT(DISTINCT mc.id_customer) FROM ' . _DB_PREFIX_ . 'macave mc';
        $nombre_clients = Db::getInstance()->executeS($request_nombre_clients);

        $request_nombre_lignes = 'SELECT COUNT(*) FROM ' . _DB_PREFIX_ . 'macave mc';
        $nombre_lignes = Db::getInstance()->executeS($request_nombre_lignes);


        $this->context->smarty->assign(
            'nombre_clients',
            $nombre_clients[0]
        );

        $this->context->smarty->assign(
            'nombre_lignes',
            $nombre_lignes[0]
        );

        return $this->display(__FILE__, 'views/templates/admin/manage.tpl');
    }

    public function uninstall()
    {
        return parent::uninstall();
    }
}
