function quicksort(arr,len){
	if (len == 0 ) return;
	var head  = 0;
	var end   = len- 1; 
	var equalIndex = 0;
	for( ;end != head; end --){
		if(arr[end] > arr[0]) continue;
		for(; head != end; head ++){
			if(arr[head] < arr[0]) continue;
			var tem = arr[end]; arr[end] = arr[head]; arr[head] = tem;
			break;
		}
		if( head == end) {
	     equalIndex = head;
         break;
		}
		continue;
	}
	equalIndex = end;
	 tem = arr[0]; arr[0] = arr[equalIndex]; arr[equalIndex] = tem;
	return arr;
}