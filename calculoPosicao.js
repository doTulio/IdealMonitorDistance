$(document).ready(function() {
	setaAtributos();
	run();
});

function escreveResultados(monitor) {
	$('#resultado_resolucao').text(monitor.x + 'x' + monitor.y);
	$('#resultado_diag_pol').text(monitor.pol);
	$('#resultado_tamanho_pol').text(monitor.tamPol.vertical.toFixed(2) + 'x' + monitor.tamPol.horizontal.toFixed(2));
	$('#resultado_tamanho_cm').text(monitor.tamCm.vertical.toFixed(2) + 'x' + monitor.tamPol.horizontal.toFixed(2));
	$('#resultado_diag_cm').text(monitor.cm.toFixed(2));
	$('#resultado_dpi').text(monitor.dpi.toFixed(2));
	$('#resultado_distancia').text(monitor.disIdealM.toFixed(2));
}

function setaAtributos() {
	var dimJanela = {
		'x': $('body').width(),
		'y': $('body').height()
	};
	$('#elemSvg').attr('width', dimJanela.x);
	$('#elemSvg').attr('height', 180);

	$('#monitor_x').mask('9?99999');
	$('#monitor_y').mask('9?99999');
	$('#monitor_pol').mask('9?9');

	$('#monitor_x').on('change', function() {
		run();
	});
	$('#monitor_y').on('change', function() {
		run();
	});
	$('#monitor_pol').on('change', function() {
		run();
	});
}

function run() {
	var monitor = realizaCalculo();
	if(monitor.erro) {
		alert("Coloque uma resolução horizontal maior que a vertical")
		return;
	}
	setaTamanho(monitor);
	escreveResultados(monitor);
	setaPosicao();
}

function setaPosicao() {
	var larguraJanela = $("body").width();
	var larguraTela = Number($('#elemSvg g rect').eq(0).attr('width'));
	var larguraBase = Number($('#elemSvg g').eq(1).attr('width'));
	var posicaoXTela = Number($('#elemSvg g').eq(0).attr('transform').match(/\d+/g)[0]);
	var posicaoXBase = Number($('#elemSvg g').eq(1).attr('transform').match(/\d+/g)[0]);
	var novaPosicaoTela = 'translate(' + String(Math.round(larguraJanela/2 - larguraTela/2)) + ',0)';
	var novaPosicaoXTela = Number(novaPosicaoTela.match(/\d+/g)[0]);
	var novaPosicaoBase = 'translate(' + String(Math.round(larguraTela/2 - larguraBase/2) + novaPosicaoXTela) + ',138)';
	$('#elemSvg g').eq(0).attr('transform', novaPosicaoTela);
	$('#elemSvg g').eq(1).attr('transform', novaPosicaoBase);
}

function setaTamanho(monitor) {
	var aspectRatio = monitor.x / monitor.y;
	var dimTela = {
		'x': $('#elemSvg g rect').eq(1).attr('width'),
		'y': $('#elemSvg g rect').eq(1).attr('height')
	};

	dimTela.x = Number(Math.round(aspectRatio * dimTela.y));
	dimTela.y = Math.round(aspectRatio * dimTela.y);
	var dimBase = {
		'x': 337,
		'y': 70
	};
	//seta o tamanho da borda cinza
	$('#elemSvg g rect').eq(0).attr('width', dimTela.x + 21);
	//seta o tamanho da tela azul
	$('#elemSvg g rect').eq(1).attr('width', dimTela.x);
	//seta o tamanho da linha preta
	var pathLinhaPreta = "M 11,124 L 11,12 L " + String(dimTela.x + 10) + ",12";
	$("#elemSvg path").first().attr("d",pathLinhaPreta);
}

function realizaCalculo() {
	var objeto = {};
	objeto.x = $('#monitor_x').val();
	objeto.y = $('#monitor_y').val();
	objeto.pol = $('#monitor_pol').val();

	/*if(!objeto.x) {
		objeto.x = '1920';
	if(!objeto.y) {
		objeto.y = '1080';
	}
	if(!objeto.pol) {
		objeto.pol = '42';
	}
	*/
	objeto.ratio = objeto.y/objeto.x;
	objeto.cm = objeto.pol * 2.54;
	objeto.tamPol = {
		'vertical': Math.sin(Math.tan(objeto.ratio)) * objeto.pol,
		'horizontal': Math.cos(Math.tan(objeto.ratio)) * objeto.pol
	};
	objeto.tamCm = {
		'vertical': objeto.tamPol.vertical * 2.54,
		'horizontal': objeto.tamPol.horizontal * 2.54
	}
	objeto.dpi = Math.sqrt(objeto.x * objeto.x + objeto.y * objeto.y)/objeto.pol;
	//segundo Jobs, o DPI ideal a uma distãncia de 10 polegadas é de 300
	//ou seja, o 300 DPI é ideal para 25,4 cm de distância da tela
	objeto.disIdealM = 300*25.4 / objeto.dpi / 100;
	return objeto;
}