<?php

namespace yeesoft\post\models;

use omgdef\multilingual\MultilingualTrait;

/**
 * This is the ActiveQuery class for [[Post]].
 *
 * @see Post
 */
class PostQuery extends \yii\db\ActiveQuery
{

    use MultilingualTrait;

    public function active()
    {
        $this->andWhere(['status' => Post::STATUS_PUBLISHED]);
        return $this;
    }

    /**
     * @inheritdoc
     * @return Post[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Post|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }

}
