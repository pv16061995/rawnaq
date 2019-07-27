<?php

use yeesoft\db\SourceMessagesMigration;

class m151121_233715_i18n_yee_post_source extends SourceMessagesMigration
{

    public function getCategory()
    {
        return 'yee/post';
    }

    public function getMessages()
    {
        return [
            'Create Tag' => 1,
            'Update Tag' => 1,
            'No posts found.' => 1,
            'Post' => 1,
            'Posted in' => 1,
            'Posts Activity' => 1,
            'Posts' => 1,
            'Tag' => 1,
            'Tags' => 1,
            'Thumbnail' => 1,
        ];
    }
}