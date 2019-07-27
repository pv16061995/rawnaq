<?php

namespace yeesoft\post\models;

use omgdef\multilingual\MultilingualTrait;
use paulzi\nestedintervals\NestedIntervalsQueryTrait;


/**
 * This is the ActiveQuery class for [[Post]].
 *
 * @see Post
 */
class CategoryQuery extends \yii\db\ActiveQuery
{

    use MultilingualTrait;
    use NestedIntervalsQueryTrait;


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
