<?php

use yeesoft\helpers\Html;
use yii\helpers\HtmlPurifier;

/* @var $this yii\web\View */
?>

    <div class="pull-<?= $position ?> col-lg-<?= $width ?> widget-height-<?= $height ?>">
        <div class="panel panel-default dw-widget">
            <div class="panel-heading"><?= Yii::t('yee/hotel', 'Hotels Activity') ?></div>
            <div class="panel-body">

                <?php if (count($recentHotels)): ?>
                    <div class="clearfix">
                        <?php foreach ($recentHotels as $hotel) : ?>
                            <div class="clearfix dw-hotel">

                                <div class="clearfix">
                                    <div style="float: right">
                                        <a class="dot-left"><?= HtmlPurifier::process($hotel->author->username); ?></a>
                                        <span class="dot-left dot-right"><?= "{$hotel->publishedDate}" ?></span>
                                    </div>
                                    <div>
                                        <?= Html::a(HtmlPurifier::process($hotel->title), ['hotel/default/view', 'id' => $hotel->id]) ?>
                                    </div>
                                </div>

                                <div class="dw-hotel-content">
                                    <?= HtmlPurifier::process(mb_substr(strip_tags($hotel->content), 0, 200, "UTF-8")); ?>
                                    <?= (strlen(strip_tags($hotel->content)) > 200) ? '...' : '' ?>
                                </div>

                            </div>

                        <?php endforeach; ?>
                    </div>

                    <div class="dw-quick-links">
                        <?php $list = [] ?>
                        <?php foreach ($hotels as $hotel) : ?>
                            <?php $list[] = Html::a("<b>{$hotel['count']}</b> {$hotel['label']}", $hotel['url']); ?>
                        <?php endforeach; ?>
                        <?= implode(' | ', $list) ?>
                    </div>

                <?php else: ?>
                    <h4><em><?= Yii::t('yee/hotel', 'No hotels found.') ?></em></h4>
                <?php endif; ?>

            </div>
        </div>
    </div>
<?php
$css = <<<CSS
.dw-widget{
    position:relative;
    padding-bottom:15px;
}
.dw-hotel {
    border-bottom: 1px solid #eee;
    margin: 7px;
    padding: 0 0 5px 5px;
}
.dw-hotel-content {
    font-size: 0.9em;
    text-align: justify;
    margin: 10px 0 5px 0;
}
.dw-quick-links{
    position: absolute;
    bottom:10px;
    left:0;
    right:0;
    text-align: center;
}
CSS;

$this->registerCss($css);
?>