<?php

/* @var $this yii\web\View */
?>

<div class="panel panel-default recent-comments">
    <div class="panel-heading"><?= Yii::t('yee', 'Recent Comments') ?></div>
    <div class="panel-body">
        <?php if (count($recentComments)): ?>
            <?php foreach ($recentComments as $comment) : ?>
                <?= $this->render($commentTemplate, ['comment' => $comment]) ?>
            <?php endforeach; ?>
        <?php else: ?>
            <h4><em><?= Yii::t('yee', 'No comments found.') ?></em></h4>
        <?php endif; ?>
    </div>
</div>
