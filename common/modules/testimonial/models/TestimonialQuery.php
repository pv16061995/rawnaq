<?php

namespace common\modules\testimonial\models;

use omgdef\multilingual\MultilingualTrait;

/**
 * This is the ActiveQuery class for [[Testimonial]].
 *
 * @see Testimonial
 */
class TestimonialQuery extends \yii\db\ActiveQuery
{

    public function active()
    {
        $this->andWhere(['status' => Testimonial::STATUS_PUBLISHED]);
        return $this;
    }

    /**
     * @inheritdoc
     * @return Testimonial[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return Testimonial|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }

}
