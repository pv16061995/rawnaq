<?php

namespace common\modules\hotel\widgets;

use yii\helpers\Html;
use yii\helpers\Json;
use yii\web\JsExpression;
use yii\widgets\InputWidget;
use common\modules\hotel\assets\Select2Asset;
use yii\helpers\ArrayHelper;
use yii\web\View;

class Select2 extends InputWidget
{
    /**
     * @var array items array to render select options
     */
    public $data = [];
    /*
     * Callback function
     * http://select2.github.io/select2/
     */
    public $ajax = "";
    public $initSelection = "";
    public $templateResult = "";
    public $formatResult = "";
    public $formatSelection = "";
    public $escapeMarkup = "";

    /*
     * option
     */
    public $containerCss;
    public $containerCssClass;
    public $disabled = false;
    public $dropdownCss;
    public $dropdownCssClass;
    public $minimumResultsForSearch = 2 ;
    public $multiple = false;
    public $maximumSelectionSize = 1;
    public $placeholder = null;

    public $clientOptions = [
    ];

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


        $this->clientOptions['data'] = $this->data; //{id:0,text:'enhancement'}
        $this->clientOptions['containerCss'] = $this->containerCss;
        $this->clientOptions['containerCssClass'] = $this->containerCssClass;
        $this->clientOptions['disabled'] = $this->disabled;
        $this->clientOptions['dropdownCss'] = $this->dropdownCss;
        $this->clientOptions['dropdownCssClass'] = $this->dropdownCssClass;
        $this->clientOptions['minimumResultsForSearch'] = $this->minimumResultsForSearch;
        $this->clientOptions['multiple'] = $this->multiple;
        $this->clientOptions['maximumSelectionSize'] = $this->maximumSelectionSize;
        $this->clientOptions['placeholder'] = $this->placeholder;
        $this->clientOptions['width'] = '100%';

        $this->registerScript();
    }

    /**
     * @inheritdoc
     */
    public function run()
    {
        if ($this->hasModel()) {
            echo Html::activeDropDownList($this->model, $this->attribute, [], $this->options);
        } else {
            echo Html::dropDownList( $this->name, $this->value,[], $this->options);
        }
    }

    /**
     * Registers script
     */
    public function registerScript()
    {
        Select2Asset::register($this->getView());
        $clientOptions = Json::encode($this->clientOptions);
        $clientOptions = substr($clientOptions, 1, strlen($clientOptions)-2);
        $options = "";
        if($this->ajax) {
            $options .= "ajax:{$this->ajax},";
        }

        if($this->templateResult) {
            $options .= "templateResult:{$this->templateResult},";
        }
        if($this->formatResult) {
            $options .= "formatResult:{$this->formatResult},";
        }
        if($this->formatSelection) {
            $options .= "formatSelection:{$this->formatSelection},";
        }
        if($this->escapeMarkup) {
            $options .= "escapeMarkup:{$this->escapeMarkup},";
        }

        if($this->multiple && $this->initSelection){
            $selectedVal = array();
            if(is_array($this->initSelection)){
                $selectedVal = $this->initSelection;
            }else{
                $selectedVal = explode(',',$selectedVal);
            }
            foreach($this->data as $item){
                if($item["id"] == $this->initSelection){
                    $selectedVal[] = $item;
                }
            }
            $selectedVal = json_encode($selectedVal);
            $this->initSelection = "function(element,callback){ var data = $selectedVal;callback(data);}";
            $options .= "initSelection:{$this->initSelection},";
        }elseif($this->initSelection){
            $selectedVal = array();
            foreach($this->data as $item){
                if($item["id"] == $this->initSelection){
                    $selectedVal[] = $item;
                }
            }
            $selectedVal = json_encode($selectedVal);
            $this->initSelection = "function(element,callback){ var data = $selectedVal;callback(data);}";
            $options .= "initSelection:{$this->initSelection},";
        }

        $options = $options.$clientOptions;
        $this->getView()->registerJs("var {$this->var} = $('#{$this->options['id']}').select2({{$options}});");
    }

}
