<?php

namespace common\modules\hotel\widgets;

use yii\helpers\Html;
use yii\helpers\Json;
use yii\web\JsExpression;
use yii\widgets\InputWidget;
use common\modules\hotel\assets\MagicSuggestAsset;

class MagicSuggest extends InputWidget
{

    /**
     * @var string placeholder text
     */
    public $placeholder = null;

    /**
     * @var string no_results_text text
     */
    public $noResultsText = null;

    /**
     * @var array items array to render select options
     */
    public $items = [];
    public $keyField = "";
    public $callback = "";
    public $resultAsString = false;

    /**
     * @var array options for plugin
     * @see http://nicolasbize.com/magicsuggest/doc.html
     */
    public $clientOptions = [
        'hideTrigger' => true,
        'toggleOnClick' => true,
    ];

    /**
     * @var array event handlers for plugin
     * @see http://nicolasbize.com/magicsuggest/doc.html
     */
    public $clientEvents = [];

    /**
     * @var string name of js variable
     */
    protected $var;

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
        $this->var = str_replace('-', '_', $this->options['id']);

        $this->clientOptions['data'] = $this->items;
        $this->clientOptions['valueField'] = $this->keyField;
        $this->clientOptions['placeholder'] = $this->placeholder;
        //$this->clientOptions['renderer'] = $this->callback;
        $this->clientOptions['resultAsString'] = $this->resultAsString;


        $this->registerScript();
        $this->registerEvents();
    }

    /**
     * @inheritdoc
     */
    public function run()
    {
        if ($this->hasModel()) {
            echo Html::activeInput('text', $this->model, $this->attribute, $this->options);
        } else {
            echo Html::input('text', $this->name, $this->value, $this->options);
        }
    }

    /**
     * Registers script
     */
    public function registerScript()
    {
        MagicSuggestAsset::register($this->getView());
        $clientOptions = Json::encode($this->clientOptions);
        if($this->callback) {
            $clientOptions = substr($clientOptions, 1, strlen($clientOptions)-1);
            $this->getView()->registerJs("var {$this->var} = $('#{$this->options['id']}').magicSuggest({'renderer':{$this->callback},$clientOptions);");
        }else{
            $this->getView()->registerJs("var {$this->var} = $('#{$this->options['id']}').magicSuggest({$clientOptions});");
        }
    }

    /**
     * Registers MagicSuggest event handlers
     */
    public function registerEvents()
    {
        if (!empty($this->clientEvents)) {
            $js = [];
            foreach ($this->clientEvents as $event => $handle) {
                $handle = new JsExpression($handle);
                $js[] = "$({$this->var}).on('{$event}', {$handle});";
            }
            $this->getView()->registerJs(implode(PHP_EOL, $js));
        }
    }

}
