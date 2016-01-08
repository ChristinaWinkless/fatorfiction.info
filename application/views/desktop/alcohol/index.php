<script type="text/javascript">

    var drinks = '<?=json_encode($alcoholData->drinks)?>';
    var drinkHotspots = '<?=$alcoholData->hotspots?>';
    var states = '<?=$alcoholData->view_states?>';

</script>

<div class="food-information alcohol is-hidden"><!-- Food Information Start -->

    <h2 class="name"><span class="line-1"></span><span class="line-2"></span></h2>
    <hr class="top"/>
    <div class="units first">
        <span class="amount"></span> Units
    </div>
    <div class="fat">
        Fat: <span class="amount"></span><span class="grams">G</span>
    </div>
    <div class="calories">
        Calories: <span class="amount"></span>
    </div>
    <div class="carbs">
        Carbs: <span class="amount"></span><span class="grams">G</span>
    </div>
    <div class="protein">
        Protein: <span class="amount"></span><span class="grams">G</span>
    </div>
    <div class="sugar">
        Sugar: <span class="amount"></span><span class="grams">G</span>
    </div>
    <hr class="bottom"/>
    <div class="weight">Per serving</div>
    <a class="back" href="#" data-view="all">Back</a>

</div><!-- Food Information End -->

<section class="infographics alcohol view-all is-hidden" style="background-image: url(<?=$alcoholData->all_drinks_image?>);"><!-- Infographics Start -->

    <canvas id="canvas-infographics" width="780" height="303" data-ipad-portrait-width="600" data-ipad-portrait-height="233"></canvas>

    <? foreach ($alcoholData->drinks as $drinks => $data) { ?>
    <div class="drink-name <?=$data->slug?> is-hidden" data-slug="<?=$data->slug?>"><?=$data->name?></div>
    <? } ?> 

</section><!-- Infographics End -->

<section class="infographics alcohol view-single is-hidden"><!-- Infographics Start -->

    <a class="arrow left" href="#" title="Left" data-direction="left"></a>
    <a class="arrow right" href="#" title="Right" data-direction="right"></a>

</section><!-- Infographics End -->

<script type="text/javascript" src="<?=base_url()?>assets/js/libs/json/json2.js" charset="UTF-8"></script>
<script type="text/javascript" src="<?=base_url()?>assets/js/libs/history/jquery.history.js" charset="UTF-8"></script>