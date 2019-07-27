<?php

use yeesoft\db\PermissionsMigration;

class m150825_202231_add_post_permissions extends PermissionsMigration
{

    public function beforeUp()
    {
        $this->addPermissionsGroup('postManagement', 'Post Management');
    }

    public function afterDown()
    {
        $this->deletePermissionsGroup('postManagement');
    }

    public function getPermissions()
    {
        return [
            'postManagement' => [
                'links' => [
                    '/admin/post/*',
                    '/admin/post/default/*',
                    '/admin/post/category/*',
                ],
                'viewPosts' => [
                    'title' => 'View Posts',
                    'links' => [
                        '/admin/post/default/index',
                        '/admin/post/default/view',
                        '/admin/post/default/grid-sort',
                        '/admin/post/default/grid-page-size',
                    ],
                    'roles' => [
                        self::ROLE_AUTHOR,
                    ],
                ],
                'editPosts' => [
                    'title' => 'Edit Posts',
                    'links' => [
                        '/admin/post/default/update',
                        '/admin/post/default/bulk-activate',
                        '/admin/post/default/bulk-deactivate',
                        '/admin/post/default/toggle-attribute',
                    ],
                    'roles' => [
                        self::ROLE_AUTHOR,
                    ],
                    'childs' => [
                        'viewPosts',
                    ],
                ],
                'createPosts' => [
                    'title' => 'Create Posts',
                    'links' => [
                        '/admin/post/default/create',
                    ],
                    'roles' => [
                        self::ROLE_AUTHOR,
                    ],
                    'childs' => [
                        'viewPosts',
                    ],
                ],
                'deletePosts' => [
                    'title' => 'Delete Posts',
                    'links' => [
                        '/admin/post/default/delete',
                        '/admin/post/default/bulk-delete',
                    ],
                    'roles' => [
                        self::ROLE_MODERATOR,
                    ],
                    'childs' => [
                        'viewPosts',
                    ],
                ],
                'fullPostAccess' => [
                    'title' => 'Full Post Access',
                    'roles' => [
                        self::ROLE_MODERATOR,
                    ],
                ],
                'viewPostCategories' => [
                    'title' => 'View Posts',
                    'links' => [
                        '/admin/post/category/index',
                        '/admin/post/category/grid-sort',
                        '/admin/post/category/grid-page-size',
                    ],
                    'roles' => [
                        self::ROLE_AUTHOR,
                    ],
                    'childs' => [
                        'viewPosts',
                    ],
                ],
                'editPostCategories' => [
                    'title' => 'Edit Post Categories',
                    'links' => [
                        '/admin/post/category/update',
                        '/admin/post/category/toggle-attribute',
                    ],
                    'roles' => [
                        self::ROLE_MODERATOR,
                    ],
                    'childs' => [
                        'viewPosts',
                    ],
                ],
                'createPostCategories' => [
                    'title' => 'Create Post Categories',
                    'links' => [
                        '/admin/post/category/create',
                    ],
                    'roles' => [
                        self::ROLE_MODERATOR,
                    ],
                    'childs' => [
                        'viewPosts',
                    ],
                ],
                'deletePostCategories' => [
                    'title' => 'Delete Post Categories',
                    'links' => [
                        '/admin/post/category/delete',
                        '/admin/post/category/bulk-delete',
                    ],
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewPosts',
                    ],
                ],
                'fullPostCategoryAccess' => [
                    'title' => 'Full Post Categories Access',
                    'roles' => [
                        self::ROLE_MODERATOR,
                    ],
                ],
                'viewPostTags' => [
                    'title' => 'View Tags',
                    'links' => [
                        '/admin/post/tag/index',
                        '/admin/post/tag/grid-sort',
                        '/admin/post/tag/grid-page-size',
                    ],
                    'roles' => [
                        self::ROLE_AUTHOR,
                    ],
                    'childs' => [
                        'viewPosts',
                    ],
                ],
                'editPostTags' => [
                    'title' => 'Edit Post Tags',
                    'links' => [
                        '/admin/post/tag/update',
                        '/admin/post/tag/toggle-attribute',
                    ],
                    'roles' => [
                        self::ROLE_MODERATOR,
                    ],
                    'childs' => [
                        'viewPostTags',
                    ],
                ],
                'createPostTags' => [
                    'title' => 'Create Post Tags',
                    'links' => [
                        '/admin/post/tag/create',
                    ],
                    'roles' => [
                        self::ROLE_MODERATOR,
                    ],
                    'childs' => [
                        'viewPostTags',
                    ],
                ],
                'deletePostTags' => [
                    'title' => 'Delete Post Tags',
                    'links' => [
                        '/admin/post/tag/delete',
                        '/admin/post/tag/bulk-delete',
                    ],
                    'roles' => [
                        self::ROLE_ADMIN,
                    ],
                    'childs' => [
                        'viewPostTags',
                    ],
                ],
                'fullPostTagAccess' => [
                    'title' => 'Full Post Tags Access',
                    'roles' => [
                        self::ROLE_MODERATOR,
                    ],
                ],
            ],
        ];
    }

}
