let a = [|1;2;3|] |> Seq.map (fun n -> n*n) |> sprintf "%A"
printfn "%s" a