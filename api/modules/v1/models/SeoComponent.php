<?php

namespace app\modules\v1\models;

use Yii;
use yii\base\Component;
use yii\caching\Cache;
use yeesoft\seo\models\Seo as SeoRecords;
use yeesoft\seo\components\Seo;

class SeoComponent extends Seo{
    
    public $fields = ['title', 'author', 'keywords', 'description', 'index', 'follow'];
    
    public $title;
    public $author;
    public $keywords;
    public $description;
    public $index        = true;
    public $follow       = true;
    public $isMetaLoaded = false;

    public function loadMetaTags($curentUrl = "/en", $preferUrlWithParams = true)
    {
        $preferOrder = ($preferUrlWithParams) ? 'DESC' : 'ASC';

        $seo = SeoRecords::find()
            ->orWhere(['url' => $curentUrl])
            ->orderBy("url $preferOrder")
            ->one();

        if ($seo) {
            foreach ($this->fields as $field) {
                if (isset($seo->{$field})) {
                    $this->{$field} = $seo->{$field};
                }
            }
        }
        
        return $this;
    }
}