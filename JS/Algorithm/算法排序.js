//快速排序
function quickSort(arr, startIndex, endIndex) {
	if (arr.length == 0 || endIndex - startIndex < 1) return;
	var i = startIndex, j = endIndex, base = arr[startIndex], tem;
	for (; j > i; j--) {
		if (arr[j] > base) continue;
		for (; i < j; i++) {
			if (arr[i] <= base) continue;
			tem = arr[j]; arr[j] = arr[i]; arr[i] = tem;
			break;
		}
		if (j == i) {
			tem = arr[j]; arr[j] = arr[startIndex]; arr[startIndex] = tem;
		}
	}
	tem = arr[j]; arr[j] = arr[startIndex]; arr[startIndex] = tem;
	quickSort(arr, startIndex, i - 1);
	quickSort(arr, i + 1, endIndex);
	return arr;
}

//选择排序
function selectSort(arr){
	var tem;
	for(var i = 0; i < arr.length - 1; i++){
		for(var j = i + 1; j < arr.length;j ++){
			if(arr[i] > arr[j]){
				tem = arr[i]; arr[i] = arr[j]; arr[j] = tem;
			}
		}
	}
	return arr;
}

//冒泡排序
function bubbleSort(arr){
	var tem,count = 0;
  for(var i = 0; i < arr.length; i ++){
		count = 0;
		for(var j = 0; j < arr.length - 1; j++){
       if(arr[j] > arr[j+1]){
				 tem = arr[j];arr[j] = arr[j+1]; arr[j+1] = tem;
				 count++;
			 }
		}
		if(count <=1) break;
	}
	return arr;
}
