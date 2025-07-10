import {pipeline , env} from '@xenova/transformers';

env.allowLocalModels=false
env.useBrowserCache=false //turning off cache to avoid bugs


self.addEventListener('message', async (e)=>{

  console.log("event came", e.data)

  let pipe=await translatorPipeline.getInstance(x=>{
    self.postMessage(x)
  })

  let translated=await pipe(e.data.text,{
    src_lang:e.data.src_lang,
    tgt_lang:e.data.tgt_lang,

    callback_function:x=>{
      let txt = pipe.tokenizer.decode(x[0].output_token_ids,{skip_special_tokens:true})
      self.postMessage({
        status:'update',
        output:txt
      })
    }
  })

console.log("done translating")

self.postMessage({
  status:"complete",
  output:translated
})
})


class translatorPipeline {
  static instance=null;
  static model='Xenova/nllb-200-distilled-600M';
  static task='translation';

  static async getInstance(progress_cb=null){
    if(this.instance==null){
this.instance=pipeline(this.task,this.model,{progress_callback:progress_cb})
    }
    return this.instance;
  }
}
