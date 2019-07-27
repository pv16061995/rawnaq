<?php

use yeesoft\db\PermissionsMigration;

class m150825_211322_add_menu_permissions extends PermissionsMigration
{

    public function beforeUp()
    {
        $this->addPermissionsGroup('menuManagement', 'Menu Management');
    }

    public function afterDown()
    {
        $this->deletePermissionsGroup('menuManagement');
    }

    public function getPermissions()
    {
        return [
            'menuManagement' => [
                'links' => [
                    '/admin/menu/*',
                    '/admin/menu/default/*',
                    '/admin/menu/link/*',
                ],
                'viewMenus' => [
                    'title' => 'View Menus',
                    'links' => [
                        '/admin/menu/default/index',
                        '/admin/menu/default/view',
                        '/admin/menu/default/grid-sort',
                        '/admin/menu/default/grid-page-size',
                    ],
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                ],
                'editMenus' => [
                    'title' => 'Edit Menus',
                    'links' => [
                        '/admin/menu/default/update',
                    ],
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewMenus',
                    ],
                ],
                'createMenus' => [
                    'title' => 'Create Menus',
                    'links' => [
                        '/admin/menu/default/create',
                    ],
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewMenus',
                    ],
                ],
                'deleteMenus' => [
                    'title' => 'Delete Menus',
                    'links' => [
                        '/admin/menu/default/delete',
                        '/admin/menu/default/bulk-delete',
                    ],
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewMenus',
                    ],
                ],
                'fullMenuAccess' => [
                    'title' => 'Full Menu Access',
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewMenus',
                    ],
                ],
                'viewMenuLinks' => [
                    'title' => 'View Menu Links',
                    'links' => [
                        '/admin/menu/link/index',
                        '/admin/menu/link/view',
                        '/admin/menu/link/grid-sort',
                        '/admin/menu/link/grid-page-size',
                    ],
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewMenus',
                    ],
                ],
                'editMenuLinks' => [
                    'title' => 'Edit Menu Links',
                    'links' => [
                        '/admin/menu/link/update',
                    ],
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewMenuLinks',
                    ],
                ],
                'createMenuLinks' => [
                    'title' => 'Create Menu Links',
                    'links' => [
                        '/admin/menu/link/create',
                    ],
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewMenuLinks',
                    ],
                ],
                'deleteMenuLinks' => [
                    'title' => 'Delete Menu Links',
                    'links' => [
                        '/admin/menu/link/delete',
                        '/admin/menu/link/bulk-delete',
                    ],
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewMenuLinks',
                    ],
                ],
                'fullMenuLinkAccess' => [
                    'title' => 'Full Menu Links Access',
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewMenuLinks',
                    ],
                ],
            ],
        ];
    }

}
