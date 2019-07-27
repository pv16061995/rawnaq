<?php

namespace common\modules\hotel\models;

use omgdef\multilingual\MultilingualTrait;
use paulzi\nestedintervals\NestedIntervalsQueryTrait;


/**
 * This is the ActiveQuery class for [[Hotel]].
 *
 * @see Hotel
 */
class DestinationQuery extends \yii\db\ActiveQuery
{

    use MultilingualTrait;
    use NestedIntervalsQueryTrait;


    /**
     * @inheritdoc
     * @return Hotel[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Hotel|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }

}
