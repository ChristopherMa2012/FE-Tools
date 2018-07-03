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
	console.log(arr)
	quickSort(arr, startIndex, i - 1);
	quickSort(arr, i + 1, endIndex);
	return arr;
}