import { supabase } from '../../lib/supabaseClient'

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
    })
    .select()

  if (error) {
    res.status(500).json({ error: error })
    return
  }

  res.status(200).json(data)
}
