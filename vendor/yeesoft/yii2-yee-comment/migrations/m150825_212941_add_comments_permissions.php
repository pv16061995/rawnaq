<?php

use yeesoft\db\PermissionsMigration;

class m150825_212941_add_comments_permissions extends PermissionsMigration
{

    public function beforeUp()
    {
        $this->addPermissionsGroup('commentManagement', 'Comment Management');
    }

    public function afterDown()
    {
        $this->deletePermissionsGroup('commentManagement');
    }

    public function getPermissions()
    {
        return [
            'commentManagement' => [
                'links' => [
                    '/admin/comment/*',
                    '/admin/comment/default/*',
                ],
                'viewComments' => [
                    'title' => 'View Comments',
                    'roles' => [self::ROLE_MODERATOR],
                    'links' => [
                        '/admin/comment/default/index',
                        '/admin/comment/default/view',
                        '/admin/comment/default/grid-sort',
                        '/admin/comment/default/grid-page-size',
                    ],
                ],
                'editComments' => [
                    'title' => 'Edit Comments',
                    'roles' => [self::ROLE_MODERATOR],
                    'childs' => ['viewComments'],
                    'links' => [
                        '/admin/comment/default/update',
                        '/admin/comment/default/bulk-activate',
                        '/admin/comment/default/bulk-deactivate',
                        '/admin/comment/default/toggle-attribute',
                        '/admin/comment/default/bulk-spam',
                        '/admin/comment/default/bulk-trash',
                    ],
                ],
                'createComments' => [
                    'title' => 'Create Comments',
                    'roles' => [self::ROLE_MODERATOR],
                    'childs' => ['viewComments'],
                    'links' => [
                        '/admin/comment/default/create',
                    ],
                ],
                'deleteComments' => [
                    'title' => 'Delete Comments',
                    'roles' => [self::ROLE_MODERATOR],
                    'childs' => ['viewComments'],
                    'links' => [
                        '/admin/comment/default/delete',
                        '/admin/comment/default/bulk-delete',
                    ],
                ],
            ],
        ];
    }

}
