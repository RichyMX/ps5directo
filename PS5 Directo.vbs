' Abre PS5 Directo sin ventana negra (en su propia ventana de aplicacion).
' Puedes arrastrar archivos encima de este archivo o de su acceso directo.
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = dir
args = ""
For Each a In WScript.Arguments
  args = args & " """ & a & """"
Next
py = ""
If sh.Run("cmd /c where pyw >nul 2>nul", 0, True) = 0 Then
  py = "pyw -3"
ElseIf sh.Run("cmd /c where pythonw >nul 2>nul", 0, True) = 0 Then
  py = "pythonw"
End If
If py = "" Then
  MsgBox "No encuentro Python. Instala Python 3 (marca 'Add to PATH') o usa 'Iniciar PS5 Directo.bat'.", 48, "PS5 Directo"
Else
  sh.Run py & " """ & dir & "\app.py""" & args, 0, False
End If
