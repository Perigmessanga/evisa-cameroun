<?xml version="1.0" encoding="UTF-8"?>
<?PowerDesigner AppLocale="UTF16" ID="{9EFC98E4-6507-4911-BBDA-23CF601C0946}" Label="" LastModificationDate="1774727774" Name="Diagramme de classes" Objects="138" Symbols="41" Target="Analyse" TargetLink="Reference" Type="{18112060-1A4B-11D1-83D9-444553540000}" signature="CLD_OBJECT_MODEL" version="15.1.0.2850"?>
<!-- Veuillez ne pas modifier ce fichier -->

<Model xmlns:a="attribute" xmlns:c="collection" xmlns:o="object">

<o:RootObject Id="o1">
<c:Children>
<o:Model Id="o2">
<a:ObjectID>9EFC98E4-6507-4911-BBDA-23CF601C0946</a:ObjectID>
<a:Name>Diagramme de classes</a:Name>
<a:Code>Diagramme_de_classes</a:Code>
<a:CreationDate>1774708092</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774726968</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:PackageOptionsText>[FolderOptions]

[FolderOptions\Class Diagram Objects]
GenerationCheckModel=Yes
GenerationPath=
GenerationOptions=
GenerationTasks=
GenerationTargets=
GenerationSelections=</a:PackageOptionsText>
<a:ModelOptionsText>[ModelOptions]

[ModelOptions\Cld]
CaseSensitive=No
DisplayName=Yes
EnableTrans=No
EnableRequirements=No
ShowClss=No
DeftAttr=int
DeftMthd=
DeftParm=int
DeftCont=
DomnDttp=Yes
DomnChck=No
DomnRule=No
SupportDelay=No
PreviewEditable=Yes
AutoRealize=No
DttpFullName=Yes
DeftClssAttrVisi=private
VBNetPreprocessingSymbols=
CSharpPreprocessingSymbols=

[ModelOptions\Cld\NamingOptionsTemplates]

[ModelOptions\Cld\ClssNamingOptions]

[ModelOptions\Cld\ClssNamingOptions\CLDPCKG]

[ModelOptions\Cld\ClssNamingOptions\CLDPCKG\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDPCKG\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDDOMN]

[ModelOptions\Cld\ClssNamingOptions\CLDDOMN\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDDOMN\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDCLASS]

[ModelOptions\Cld\ClssNamingOptions\CLDCLASS\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDCLASS\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDINTF]

[ModelOptions\Cld\ClssNamingOptions\CLDINTF\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDINTF\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\UCDACTR]

[ModelOptions\Cld\ClssNamingOptions\UCDACTR\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\UCDACTR\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\UCDUCAS]

[ModelOptions\Cld\ClssNamingOptions\UCDUCAS\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\UCDUCAS\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\SQDOBJT]

[ModelOptions\Cld\ClssNamingOptions\SQDOBJT\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\SQDOBJT\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\SQDMSSG]

[ModelOptions\Cld\ClssNamingOptions\SQDMSSG\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\SQDMSSG\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CPDCOMP]

[ModelOptions\Cld\ClssNamingOptions\CPDCOMP\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CPDCOMP\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDATTR]

[ModelOptions\Cld\ClssNamingOptions\CLDATTR\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDATTR\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDMETHOD]

[ModelOptions\Cld\ClssNamingOptions\CLDMETHOD\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDMETHOD\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDPARM]

[ModelOptions\Cld\ClssNamingOptions\CLDPARM\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDPARM\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\OOMPORT]

[ModelOptions\Cld\ClssNamingOptions\OOMPORT\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\OOMPORT\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\OOMPART]

[ModelOptions\Cld\ClssNamingOptions\OOMPART\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\OOMPART\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDASSC]

[ModelOptions\Cld\ClssNamingOptions\CLDASSC\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\CLDASSC\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\UCDASSC]

[ModelOptions\Cld\ClssNamingOptions\UCDASSC\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\UCDASSC\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\GNRLLINK]

[ModelOptions\Cld\ClssNamingOptions\GNRLLINK\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\GNRLLINK\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\RQLINK]

[ModelOptions\Cld\ClssNamingOptions\RQLINK\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\RQLINK\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\RLZSLINK]

[ModelOptions\Cld\ClssNamingOptions\RLZSLINK\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\RLZSLINK\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\DEPDLINK]

[ModelOptions\Cld\ClssNamingOptions\DEPDLINK\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\DEPDLINK\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\OOMACTV]

[ModelOptions\Cld\ClssNamingOptions\OOMACTV\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\OOMACTV\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\ACDOBST]

[ModelOptions\Cld\ClssNamingOptions\ACDOBST\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\ACDOBST\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\STAT]

[ModelOptions\Cld\ClssNamingOptions\STAT\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\STAT\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\DPDNODE]

[ModelOptions\Cld\ClssNamingOptions\DPDNODE\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\DPDNODE\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\DPDCMPI]

[ModelOptions\Cld\ClssNamingOptions\DPDCMPI\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\DPDCMPI\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\DPDASSC]

[ModelOptions\Cld\ClssNamingOptions\DPDASSC\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\DPDASSC\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\OOMVAR]

[ModelOptions\Cld\ClssNamingOptions\OOMVAR\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\OOMVAR\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\FILO]

[ModelOptions\Cld\ClssNamingOptions\FILO\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=&quot;\/:*?&lt;&gt;|&quot;
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\FILO\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_. &quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\FRMEOBJ]

[ModelOptions\Cld\ClssNamingOptions\FRMEOBJ\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\FRMEOBJ\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\FRMELNK]

[ModelOptions\Cld\ClssNamingOptions\FRMELNK\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\FRMELNK\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\DefaultClass]

[ModelOptions\Cld\ClssNamingOptions\DefaultClass\Name]
Template=
MaxLen=254
Case=M
ValidChar=
InvldChar=
AllValid=Yes
NoAccent=No
DefaultChar=_
Script=.convert_name(%Name%,&quot;_&quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Cld\ClssNamingOptions\DefaultClass\Code]
Template=
MaxLen=254
Case=M
ValidChar=&#39;a&#39;-&#39;z&#39;,&#39;A&#39;-&#39;Z&#39;,&#39;0&#39;-&#39;9&#39;,&quot;_&quot;
InvldChar=&quot; +-*/!=&lt;&gt;&#39;&quot;&quot;().&quot;
AllValid=Yes
NoAccent=Yes
DefaultChar=_
Script=.convert_code(%Code%,&quot; &quot;)
ConvTable=
ConvTablePath=%_HOME%\Fichiers de ressources\Tables de conversion

[ModelOptions\Generate]

[ModelOptions\Generate\Cdm]
CheckModel=Yes
SaveLinks=Yes
NameToCode=No
Notation=2

[ModelOptions\Generate\Pdm]
CheckModel=Yes
SaveLinks=Yes
ORMapping=No
NameToCode=No
BuildTrgr=No
TablePrefix=
RefrUpdRule=RESTRICT
RefrDelRule=RESTRICT
IndxPKName=%TABLE%_PK
IndxAKName=%TABLE%_AK
IndxFKName=%REFR%_FK
IndxThreshold=
ColnFKName=%.3:PARENT%_%COLUMN%
ColnFKNameUse=No

[ModelOptions\Generate\Xsm]
CheckModel=Yes
SaveLinks=Yes
ORMapping=No
NameToCode=No</a:ModelOptionsText>
<c:ObjectLanguage>
<o:Shortcut Id="o3">
<a:ObjectID>2655ECB0-F664-4480-A47C-4360503087F6</a:ObjectID>
<a:Name>Analyse</a:Name>
<a:Code>Analysis</a:Code>
<a:CreationDate>1774708091</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774708091</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TargetStereotype/>
<a:TargetID>87317290-AF03-469F-BC1E-99593F18A4AB</a:TargetID>
<a:TargetClassID>1811206C-1A4B-11D1-83D9-444553540000</a:TargetClassID>
</o:Shortcut>
</c:ObjectLanguage>
<c:ClassDiagrams>
<o:ClassDiagram Id="o4">
<a:ObjectID>1C5CA28C-A7E9-4C8E-8BB1-5CDEB816E0AB</a:ObjectID>
<a:Name>DiagrammeClasses_1</a:Name>
<a:Code>DiagrammeClasses_1</a:Code>
<a:CreationDate>1774708092</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774726979</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DisplayPreferences>[DisplayPreferences]

[DisplayPreferences\CLD]

[DisplayPreferences\General]
Adjust to text=Yes
Snap Grid=No
Constrain Labels=Yes
Display Grid=No
Show Page Delimiter=Yes
Grid size=0
Graphic unit=2
Window color=255, 255, 255
Background image=
Background mode=8
Watermark image=
Watermark mode=8
Show watermark on screen=No
Gradient mode=0
Gradient end color=255, 255, 255
Show Swimlane=No
SwimlaneVert=Yes
TreeVert=No
CompDark=0

[DisplayPreferences\Object]
Mode=2
Trunc Length=40
Word Length=40
Word Text=!&quot;&quot;#$%&amp;&#39;()*+,-./:;&lt;=&gt;?@[\]^_`{|}~
Shortcut IntIcon=Yes
Shortcut IntLoct=Yes
Shortcut IntFullPath=No
Shortcut IntLastPackage=Yes
Shortcut ExtIcon=Yes
Shortcut ExtLoct=No
Shortcut ExtFullPath=No
Shortcut ExtLastPackage=Yes
Shortcut ExtIncludeModl=Yes
EObjShowStrn=Yes
ExtendedObject.Comment=No
ExtendedObject.IconPicture=No
ExtendedObject_SymbolLayout=&lt;Form&gt;[CRLF] &lt;StandardAttribute Name=&quot;Stéréotype&quot; Attribute=&quot;Stereotype&quot; Prefix=&quot;&amp;lt;&amp;lt;&quot; Suffix=&quot;&amp;gt;&amp;gt;&quot; Alignment=&quot;CNTR&quot; Caption=&quot;&quot; Mandatory=&quot;No&quot; /&gt;[CRLF] &lt;StandardAttribute Name=&quot;Nom de l&amp;#39;objet&quot; Attribute=&quot;DisplayName&quot; Prefix=&quot;&quot; Suffix=&quot;&quot; Alignment=&quot;CNTR&quot; Caption=&quot;&quot; Mandatory=&quot;Yes&quot; /&gt;[CRLF] &lt;Separator Name=&quot;Séparateur&quot; /&gt;[CRLF] &lt;StandardAttribute Name=&quot;Commentaire&quot; Attribute=&quot;Comment&quot; Prefix=&quot;&quot; Suffix=&quot;&quot; Alignment=&quot;LEFT&quot; Caption=&quot;&quot; Mandatory=&quot;No&quot; /&gt;[CRLF] &lt;StandardAttribute Name=&quot;Icône&quot; Attribute=&quot;IconPicture&quot; Prefix=&quot;&quot; Suffix=&quot;&quot; Alignment=&quot;CNTR&quot; Caption=&quot;&quot; Mandatory=&quot;Yes&quot; /&gt;[CRLF]&lt;/Form&gt;
ELnkShowStrn=Yes
ELnkShowName=Yes
ExtendedLink_SymbolLayout=&lt;Form&gt;[CRLF] &lt;Form Name=&quot;Centre&quot; &gt;[CRLF]  &lt;StandardAttribute Name=&quot;Stéréotype&quot; Attribute=&quot;Stereotype&quot; Prefix=&quot;&amp;lt;&amp;lt;&quot; Suffix=&quot;&amp;gt;&amp;gt;&quot; Caption=&quot;&quot; Mandatory=&quot;No&quot; /&gt;[CRLF]  &lt;StandardAttribute Name=&quot;Nom&quot; Attribute=&quot;DisplayName&quot; Prefix=&quot;&quot; Suffix=&quot;&quot; Caption=&quot;&quot; Mandatory=&quot;No&quot; /&gt;[CRLF] &lt;/Form&gt;[CRLF] &lt;Form Name=&quot;Source&quot; &gt;[CRLF] &lt;/Form&gt;[CRLF] &lt;Form Name=&quot;Destination&quot; &gt;[CRLF] &lt;/Form&gt;[CRLF]&lt;/Form&gt;
FileObject.Stereotype=No
FileObject.DisplayName=Yes
FileObject.LocationOrName=No
FileObject.IconPicture=No
FileObject.IconMode=Yes
FileObject_SymbolLayout=&lt;Form&gt;[CRLF] &lt;StandardAttribute Name=&quot;Stéréotype&quot; Attribute=&quot;Stereotype&quot; Prefix=&quot;&amp;lt;&amp;lt;&quot; Suffix=&quot;&amp;gt;&amp;gt;&quot; Alignment=&quot;CNTR&quot; Caption=&quot;&quot; Mandatory=&quot;No&quot; /&gt;[CRLF] &lt;ExclusiveChoice Name=&quot;Choix exclusif&quot; Mandatory=&quot;Yes&quot; Display=&quot;HorizontalRadios&quot; &gt;[CRLF]  &lt;StandardAttribute Name=&quot;Nom&quot; Attribute=&quot;DisplayName&quot; Prefix=&quot;&quot; Suffix=&quot;&quot; Alignment=&quot;CNTR&quot; Caption=&quot;&quot; Mandatory=&quot;No&quot; /&gt;[CRLF]  &lt;StandardAttribute Name=&quot;Emplacement&quot; Attribute=&quot;LocationOrName&quot; Prefix=&quot;&quot; Suffix=&quot;&quot; Alignment=&quot;CNTR&quot; Caption=&quot;&quot; Mandatory=&quot;No&quot; /&gt;[CRLF] &lt;/ExclusiveChoice&gt;[CRLF] &lt;StandardAttribute Name=&quot;Icône&quot; Attribute=&quot;IconPicture&quot; Prefix=&quot;&quot; Suffix=&quot;&quot; Alignment=&quot;CNTR&quot; Caption=&quot;&quot; Mandatory=&quot;Yes&quot; /&gt;[CRLF]&lt;/Form&gt;
PckgShowStrn=Yes
Package.Comment=No
Package.IconPicture=No
Package_SymbolLayout=
Display Model Version=Yes
Class.IconPicture=No
Class_SymbolLayout=
Interface.IconPicture=No
Interface_SymbolLayout=
Port.IconPicture=No
Port_SymbolLayout=
ClssShowSttr=Yes
Class.Comment=No
ClssShowCntr=Yes
ClssShowAttr=Yes
ClssAttrTrun=No
ClssAttrMax=3
ClssShowMthd=Yes
ClssMthdTrun=No
ClssMthdMax=3
ClssShowInnr=Yes
IntfShowSttr=Yes
Interface.Comment=No
IntfShowAttr=Yes
IntfAttrTrun=No
IntfAttrMax=3
IntfShowMthd=Yes
IntfMthdTrun=No
IntfMthdMax=3
IntfShowCntr=Yes
IntfShowInnr=Yes
PortShowName=Yes
PortShowType=No
PortShowMult=No
AttrShowVisi=Yes
AttrVisiFmt=1
AttrShowStrn=Yes
AttrShowDttp=Yes
AttrShowDomn=No
AttrShowInit=Yes
MthdShowVisi=Yes
MthdVisiFmt=1
MthdShowStrn=Yes
MthdShowRttp=Yes
MthdShowParm=Yes
AsscShowName=No
AsscShowCntr=Yes
AsscShowRole=Yes
AsscShowOrdr=Yes
AsscShowMult=Yes
AsscMultStr=Yes
AsscShowStrn=No
GnrlShowName=No
GnrlShowStrn=Yes
GnrlShowCntr=Yes
RlzsShowName=No
RlzsShowStrn=Yes
RlzsShowCntr=Yes
DepdShowName=No
DepdShowStrn=Yes
DepdShowCntr=Yes
RqlkShowName=No
RqlkShowStrn=Yes
RqlkShowCntr=Yes

[DisplayPreferences\Symbol]

[DisplayPreferences\Symbol\FRMEOBJ]
STRNFont=Arial,8,N
STRNFont color=0, 0, 0
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
LABLFont=Arial,8,N
LABLFont color=0, 0, 0
AutoAdjustToText=Yes
Keep aspect=No
Keep center=No
Keep size=No
Width=6000
Height=2000
Brush color=255 255 255
Fill Color=Yes
Brush style=6
Brush bitmap mode=12
Brush gradient mode=64
Brush gradient color=192 192 192
Brush background image=
Custom shape=
Custom text mode=0
Pen=1 0 255 128 128
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\FRMELNK]
CENTERFont=Arial,8,N
CENTERFont color=0, 0, 0
Line style=1
AutoAdjustToText=Yes
Keep aspect=No
Keep center=No
Keep size=No
Brush color=255 255 255
Fill Color=Yes
Brush style=1
Brush bitmap mode=12
Brush gradient mode=0
Brush gradient color=118 118 118
Brush background image=
Custom shape=
Custom text mode=0
Pen=1 0 128 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\FILO]
OBJSTRNFont=Arial,8,N
OBJSTRNFont color=0, 0, 0
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
LCNMFont=Arial,8,N
LCNMFont color=0, 0, 0
AutoAdjustToText=Yes
Keep aspect=No
Keep center=No
Keep size=No
Width=4800
Height=3600
Brush color=255 255 255
Fill Color=Yes
Brush style=1
Brush bitmap mode=12
Brush gradient mode=0
Brush gradient color=118 118 118
Brush background image=
Custom shape=
Custom text mode=0
Pen=1 0 0 0 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\CLDPCKG]
STRNFont=Arial,8,N
STRNFont color=0, 0, 0
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
LABLFont=Arial,8,N
LABLFont color=0, 0, 0
AutoAdjustToText=Yes
Keep aspect=No
Keep center=No
Keep size=No
Width=4800
Height=3600
Brush color=255 255 192
Fill Color=Yes
Brush style=6
Brush bitmap mode=12
Brush gradient mode=65
Brush gradient color=255 255 255
Brush background image=
Custom shape=
Custom text mode=0
Pen=1 0 178 178 178
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\CLDCLASS]
STRNFont=Arial,8,N
STRNFont color=0, 0, 0
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
CNTRFont=Arial,8,N
CNTRFont color=0, 0, 0
AttributesFont=Arial,8,N
AttributesFont color=0, 0, 0
ClassPrimaryAttributeFont=Arial,8,U
ClassPrimaryAttributeFont color=0, 0, 0
OperationsFont=Arial,8,N
OperationsFont color=0, 0, 0
InnerClassifiersFont=Arial,8,N
InnerClassifiersFont color=0, 0, 0
LABLFont=Arial,8,N
LABLFont color=0, 0, 0
AutoAdjustToText=Yes
Keep aspect=No
Keep center=No
Keep size=No
Width=4800
Height=3600
Brush color=174 228 255
Fill Color=Yes
Brush style=6
Brush bitmap mode=12
Brush gradient mode=65
Brush gradient color=255 255 255
Brush background image=
Custom shape=
Custom text mode=0
Pen=1 0 0 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\CLDINTF]
STRNFont=Arial,8,N
STRNFont color=0, 0, 0
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
CNTRFont=Arial,8,N
CNTRFont color=0, 0, 0
AttributesFont=Arial,8,N
AttributesFont color=0, 0, 0
OperationsFont=Arial,8,N
OperationsFont color=0, 0, 0
InnerClassifiersFont=Arial,8,N
InnerClassifiersFont color=0, 0, 0
LABLFont=Arial,8,N
LABLFont color=0, 0, 0
AutoAdjustToText=Yes
Keep aspect=No
Keep center=No
Keep size=No
Width=4800
Height=3600
Brush color=208 208 255
Fill Color=Yes
Brush style=6
Brush bitmap mode=12
Brush gradient mode=65
Brush gradient color=255 255 255
Brush background image=
Custom shape=
Custom text mode=0
Pen=1 0 128 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\OOMPORT]
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
AutoAdjustToText=Yes
Keep aspect=No
Keep center=No
Keep size=No
Width=800
Height=800
Brush color=174 228 255
Fill Color=Yes
Brush style=6
Brush bitmap mode=12
Brush gradient mode=65
Brush gradient color=255 255 255
Brush background image=
Custom shape=
Custom text mode=0
Pen=1 0 0 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\CLDASSC]
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
MULAFont=Arial,8,N
MULAFont color=0, 0, 0
Line style=1
Pen=1 0 0 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\INNERLINK]
Line style=1
Pen=1 0 0 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\CLDACLK]
Line style=1
Pen=2 0 0 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\GNRLLINK]
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
Line style=1
Pen=1 0 128 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\RLZSLINK]
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
Line style=1
Pen=3 0 128 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\RQLINK]
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
Line style=1
Pen=1 0 128 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\DEPDLINK]
DISPNAMEFont=Arial,8,N
DISPNAMEFont color=0, 0, 0
Line style=1
Pen=2 0 128 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\USRDEPD]
OBJXSTRFont=Arial,8,N
OBJXSTRFont color=0, 0, 0
Line style=1
AutoAdjustToText=Yes
Keep aspect=No
Keep center=No
Keep size=No
Brush color=255 255 255
Fill Color=Yes
Brush style=1
Brush bitmap mode=12
Brush gradient mode=0
Brush gradient color=118 118 118
Brush background image=
Custom shape=
Custom text mode=0
Pen=2 0 128 128 255
Shadow color=192 192 192
Shadow=0

[DisplayPreferences\Symbol\Free Symbol]
Free TextFont=Arial,8,N
Free TextFont color=0, 0, 0
Line style=0
AutoAdjustToText=Yes
Keep aspect=No
Keep center=No
Keep size=No
Brush color=255 255 255
Fill Color=Yes
Brush style=1
Brush bitmap mode=12
Brush gradient mode=0
Brush gradient color=118 118 118
Brush background image=
Custom shape=
Custom text mode=0
Pen=1 0 0 0 255
Shadow color=192 192 192
Shadow=0</a:DisplayPreferences>
<a:PaperSize>(8268, 11693)</a:PaperSize>
<a:PageMargins>((315,354), (433,354))</a:PageMargins>
<a:PageOrientation>1</a:PageOrientation>
<a:PaperSource>15</a:PaperSource>
<c:Symbols>
<o:TextSymbol Id="o5">
<a:Text>composer</a:Text>
<a:CreationDate>1774726979</a:CreationDate>
<a:ModificationDate>1774727136</a:ModificationDate>
<a:Rect>((-11099,45526), (-6300,49125))</a:Rect>
<a:TextStyle>4130</a:TextStyle>
<a:LineColor>0</a:LineColor>
<a:DashStyle>7</a:DashStyle>
<a:FillColor>0</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontName>Arial,8,N</a:FontName>
</o:TextSymbol>
<o:AssociationSymbol Id="o6">
<a:CreationDate>1774726968</a:CreationDate>
<a:ModificationDate>1774726968</a:ModificationDate>
<a:Rect>((-15900,36000), (-6150,54199))</a:Rect>
<a:ListOfPoints>((-15900,53025),(-6150,53025),(-6150,36000))</a:ListOfPoints>
<a:CornerStyle>1</a:CornerStyle>
<a:ArrowStyle>8</a:ArrowStyle>
<a:LineColor>16744448</a:LineColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>DISPNAME 0 Arial,8,N
MULA 0 Arial,8,N</a:FontList>
<c:SourceSymbol>
<o:ClassSymbol Ref="o7"/>
</c:SourceSymbol>
<c:DestinationSymbol>
<o:ClassSymbol Ref="o8"/>
</c:DestinationSymbol>
<c:Object>
<o:Association Ref="o9"/>
</c:Object>
</o:AssociationSymbol>
<o:TextSymbol Id="o10">
<a:Text>soumettre
</a:Text>
<a:CreationDate>1774723935</a:CreationDate>
<a:ModificationDate>1774724076</a:ModificationDate>
<a:Rect>((-21224,26626), (-16425,30225))</a:Rect>
<a:TextStyle>4130</a:TextStyle>
<a:LineColor>0</a:LineColor>
<a:DashStyle>7</a:DashStyle>
<a:FillColor>0</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontName>Arial,8,N</a:FontName>
</o:TextSymbol>
<o:TextSymbol Id="o11">
<a:Text>traiter</a:Text>
<a:CreationDate>1774723939</a:CreationDate>
<a:ModificationDate>1774726699</a:ModificationDate>
<a:Rect>((-21524,31351), (-16725,34950))</a:Rect>
<a:TextStyle>4130</a:TextStyle>
<a:LineColor>0</a:LineColor>
<a:DashStyle>7</a:DashStyle>
<a:FillColor>0</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontName>Arial,8,N</a:FontName>
</o:TextSymbol>
<o:TextSymbol Id="o12">
<a:Text>est de type</a:Text>
<a:CreationDate>1774723941</a:CreationDate>
<a:ModificationDate>1774724303</a:ModificationDate>
<a:Rect>((10276,27226), (15075,30825))</a:Rect>
<a:TextStyle>4130</a:TextStyle>
<a:LineColor>0</a:LineColor>
<a:DashStyle>7</a:DashStyle>
<a:FillColor>0</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontName>Arial,8,N</a:FontName>
</o:TextSymbol>
<o:TextSymbol Id="o13">
<a:Text>contenir</a:Text>
<a:CreationDate>1774723943</a:CreationDate>
<a:ModificationDate>1774727529</a:ModificationDate>
<a:Rect>((-2099,44401), (2700,48000))</a:Rect>
<a:TextStyle>4130</a:TextStyle>
<a:LineColor>0</a:LineColor>
<a:DashStyle>7</a:DashStyle>
<a:FillColor>0</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontName>Arial,8,N</a:FontName>
</o:TextSymbol>
<o:TextSymbol Id="o14">
<a:Text>effectuer
</a:Text>
<a:CreationDate>1774723945</a:CreationDate>
<a:ModificationDate>1774726888</a:ModificationDate>
<a:Rect>((-40274,44926), (-35475,48525))</a:Rect>
<a:TextStyle>4130</a:TextStyle>
<a:LineColor>0</a:LineColor>
<a:DashStyle>7</a:DashStyle>
<a:FillColor>0</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontName>Arial,8,N</a:FontName>
</o:TextSymbol>
<o:TextSymbol Id="o15">
<a:Text>generer</a:Text>
<a:CreationDate>1774723948</a:CreationDate>
<a:ModificationDate>1774725326</a:ModificationDate>
<a:Rect>((-23849,11626), (-19050,15225))</a:Rect>
<a:TextStyle>4130</a:TextStyle>
<a:LineColor>0</a:LineColor>
<a:DashStyle>7</a:DashStyle>
<a:FillColor>0</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontName>Arial,8,N</a:FontName>
</o:TextSymbol>
<o:TextSymbol Id="o16">
<a:Text>recevoir
</a:Text>
<a:CreationDate>1774723949</a:CreationDate>
<a:ModificationDate>1774725273</a:ModificationDate>
<a:Rect>((-47699,11851), (-42900,15450))</a:Rect>
<a:TextStyle>4130</a:TextStyle>
<a:LineColor>0</a:LineColor>
<a:DashStyle>7</a:DashStyle>
<a:FillColor>0</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontName>Arial,8,N</a:FontName>
</o:TextSymbol>
<o:TextSymbol Id="o17">
<a:Text>contenir</a:Text>
<a:CreationDate>1774723952</a:CreationDate>
<a:ModificationDate>1774726825</a:ModificationDate>
<a:Rect>((-2549,6076), (2250,9675))</a:Rect>
<a:TextStyle>4130</a:TextStyle>
<a:LineColor>0</a:LineColor>
<a:DashStyle>7</a:DashStyle>
<a:FillColor>0</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontName>Arial,8,N</a:FontName>
</o:TextSymbol>
<o:TextSymbol Id="o18">
<a:Text>produire</a:Text>
<a:CreationDate>1774723953</a:CreationDate>
<a:ModificationDate>1774725191</a:ModificationDate>
<a:Rect>((9001,19426), (13800,23025))</a:Rect>
<a:TextStyle>4130</a:TextStyle>
<a:LineColor>0</a:LineColor>
<a:DashStyle>7</a:DashStyle>
<a:FillColor>0</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontName>Arial,8,N</a:FontName>
</o:TextSymbol>
<o:AssociationSymbol Id="o19">
<a:CreationDate>1774723441</a:CreationDate>
<a:ModificationDate>1774723441</a:ModificationDate>
<a:Rect>((-27900,25826), (-9225,28174))</a:Rect>
<a:ListOfPoints>((-27900,27000),(-9225,27000))</a:ListOfPoints>
<a:CornerStyle>1</a:CornerStyle>
<a:ArrowStyle>8</a:ArrowStyle>
<a:LineColor>16744448</a:LineColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>DISPNAME 0 Arial,8,N
MULA 0 Arial,8,N</a:FontList>
<c:SourceSymbol>
<o:ClassSymbol Ref="o20"/>
</c:SourceSymbol>
<c:DestinationSymbol>
<o:ClassSymbol Ref="o8"/>
</c:DestinationSymbol>
<c:Object>
<o:Association Ref="o21"/>
</c:Object>
</o:AssociationSymbol>
<o:AssociationSymbol Id="o22">
<a:CreationDate>1774723533</a:CreationDate>
<a:ModificationDate>1774723542</a:ModificationDate>
<a:Rect>((4500,26426), (21225,28924))</a:Rect>
<a:ListOfPoints>((4500,27750),(12574,27750),(12574,27600),(21225,27600))</a:ListOfPoints>
<a:CornerStyle>1</a:CornerStyle>
<a:ArrowStyle>8</a:ArrowStyle>
<a:LineColor>16744448</a:LineColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>DISPNAME 0 Arial,8,N
MULA 0 Arial,8,N</a:FontList>
<c:SourceSymbol>
<o:ClassSymbol Ref="o8"/>
</c:SourceSymbol>
<c:DestinationSymbol>
<o:ClassSymbol Ref="o23"/>
</c:DestinationSymbol>
<c:Object>
<o:Association Ref="o24"/>
</c:Object>
</o:AssociationSymbol>
<o:AssociationSymbol Id="o25">
<a:CreationDate>1774723571</a:CreationDate>
<a:ModificationDate>1774723571</a:ModificationDate>
<a:Rect>((2175,6975), (15075,21124))</a:Rect>
<a:ListOfPoints>((2175,19950),(15075,19950),(15075,6975))</a:ListOfPoints>
<a:CornerStyle>1</a:CornerStyle>
<a:ArrowStyle>8</a:ArrowStyle>
<a:LineColor>16744448</a:LineColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>DISPNAME 0 Arial,8,N
MULA 0 Arial,8,N</a:FontList>
<c:SourceSymbol>
<o:ClassSymbol Ref="o8"/>
</c:SourceSymbol>
<c:DestinationSymbol>
<o:ClassSymbol Ref="o26"/>
</c:DestinationSymbol>
<c:Object>
<o:Association Ref="o27"/>
</c:Object>
</o:AssociationSymbol>
<o:AssociationSymbol Id="o28">
<a:CreationDate>1774723608</a:CreationDate>
<a:ModificationDate>1774723627</a:ModificationDate>
<a:Rect>((-45036,5475), (-31012,20100))</a:Rect>
<a:ListOfPoints>((-31012,20100),(-43162,20100),(-43162,5475))</a:ListOfPoints>
<a:CornerStyle>1</a:CornerStyle>
<a:ArrowStyle>8</a:ArrowStyle>
<a:LineColor>16744448</a:LineColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>DISPNAME 0 Arial,8,N
MULA 0 Arial,8,N</a:FontList>
<c:SourceSymbol>
<o:ClassSymbol Ref="o20"/>
</c:SourceSymbol>
<c:DestinationSymbol>
<o:ClassSymbol Ref="o29"/>
</c:DestinationSymbol>
<c:Object>
<o:Association Ref="o30"/>
</c:Object>
</o:AssociationSymbol>
<o:AssociationSymbol Id="o31">
<a:CreationDate>1774723634</a:CreationDate>
<a:ModificationDate>1774723889</a:ModificationDate>
<a:Rect>((-29775,4050), (-23925,21499))</a:Rect>
<a:ListOfPoints>((-29775,20325),(-23925,20325),(-23925,4050))</a:ListOfPoints>
<a:CornerStyle>1</a:CornerStyle>
<a:ArrowStyle>8</a:ArrowStyle>
<a:LineColor>16744448</a:LineColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>DISPNAME 0 Arial,8,N
MULA 0 Arial,8,N</a:FontList>
<c:SourceSymbol>
<o:ClassSymbol Ref="o20"/>
</c:SourceSymbol>
<c:DestinationSymbol>
<o:ClassSymbol Ref="o32"/>
</c:DestinationSymbol>
<c:Object>
<o:Association Ref="o33"/>
</c:Object>
</o:AssociationSymbol>
<o:AssociationSymbol Id="o34">
<a:CreationDate>1774723683</a:CreationDate>
<a:ModificationDate>1774723683</a:ModificationDate>
<a:Rect>((-28575,30851), (-8475,33199))</a:Rect>
<a:ListOfPoints>((-28575,32025),(-8475,32025))</a:ListOfPoints>
<a:CornerStyle>1</a:CornerStyle>
<a:ArrowStyle>8</a:ArrowStyle>
<a:LineColor>16744448</a:LineColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>DISPNAME 0 Arial,8,N
MULA 0 Arial,8,N</a:FontList>
<c:SourceSymbol>
<o:ClassSymbol Ref="o20"/>
</c:SourceSymbol>
<c:DestinationSymbol>
<o:ClassSymbol Ref="o8"/>
</c:DestinationSymbol>
<c:Object>
<o:Association Ref="o35"/>
</c:Object>
</o:AssociationSymbol>
<o:AssociationSymbol Id="o36">
<a:CreationDate>1774723846</a:CreationDate>
<a:ModificationDate>1774723874</a:ModificationDate>
<a:Rect>((-38099,32400), (-27675,52575))</a:Rect>
<a:ListOfPoints>((-36075,32400),(-36075,52575),(-27675,52575))</a:ListOfPoints>
<a:CornerStyle>1</a:CornerStyle>
<a:ArrowStyle>8</a:ArrowStyle>
<a:LineColor>16744448</a:LineColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>DISPNAME 0 Arial,8,N
MULA 0 Arial,8,N</a:FontList>
<c:SourceSymbol>
<o:ClassSymbol Ref="o20"/>
</c:SourceSymbol>
<c:DestinationSymbol>
<o:ClassSymbol Ref="o7"/>
</c:DestinationSymbol>
<c:Object>
<o:Association Ref="o37"/>
</c:Object>
</o:AssociationSymbol>
<o:AssociationSymbol Id="o38">
<a:CreationDate>1774723854</a:CreationDate>
<a:ModificationDate>1774723882</a:ModificationDate>
<a:Rect>((-4424,34350), (10350,54225))</a:Rect>
<a:ListOfPoints>((-2400,34350),(-2400,54225),(10350,54225))</a:ListOfPoints>
<a:CornerStyle>1</a:CornerStyle>
<a:ArrowStyle>8</a:ArrowStyle>
<a:LineColor>16744448</a:LineColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>DISPNAME 0 Arial,8,N
MULA 0 Arial,8,N</a:FontList>
<c:SourceSymbol>
<o:ClassSymbol Ref="o8"/>
</c:SourceSymbol>
<c:DestinationSymbol>
<o:ClassSymbol Ref="o39"/>
</c:DestinationSymbol>
<c:Object>
<o:Association Ref="o40"/>
</c:Object>
</o:AssociationSymbol>
<o:AssociationSymbol Id="o41">
<a:CreationDate>1774723863</a:CreationDate>
<a:ModificationDate>1774723863</a:ModificationDate>
<a:Rect>((-4911,-1275), (-1013,15300))</a:Rect>
<a:ListOfPoints>((-3037,15300),(-3037,-1275))</a:ListOfPoints>
<a:CornerStyle>1</a:CornerStyle>
<a:ArrowStyle>8</a:ArrowStyle>
<a:LineColor>16744448</a:LineColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>DISPNAME 0 Arial,8,N
MULA 0 Arial,8,N</a:FontList>
<c:SourceSymbol>
<o:ClassSymbol Ref="o8"/>
</c:SourceSymbol>
<c:DestinationSymbol>
<o:ClassSymbol Ref="o42"/>
</c:DestinationSymbol>
<c:Object>
<o:Association Ref="o43"/>
</c:Object>
</o:AssociationSymbol>
<o:ClassSymbol Id="o20">
<a:CreationDate>1774718279</a:CreationDate>
<a:ModificationDate>1774720686</a:ModificationDate>
<a:IconMode>-1</a:IconMode>
<a:Rect>((-41671,17972), (-27177,35426))</a:Rect>
<a:LineColor>16744448</a:LineColor>
<a:FillColor>16770222</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>STRN 0 Arial,8,N
DISPNAME 0 Arial,8,N
CNTR 0 Arial,8,N
Attributes 0 Arial,8,N
ClassPrimaryAttribute 0 Arial,8,U
Operations 0 Arial,8,N
InnerClassifiers 0 Arial,8,N
LABL 0 Arial,8,N</a:FontList>
<a:BrushStyle>6</a:BrushStyle>
<a:GradientFillMode>65</a:GradientFillMode>
<a:GradientEndColor>16777215</a:GradientEndColor>
<c:Object>
<o:Class Ref="o44"/>
</c:Object>
</o:ClassSymbol>
<o:ClassSymbol Id="o39">
<a:CreationDate>1774718280</a:CreationDate>
<a:ModificationDate>1774723832</a:ModificationDate>
<a:IconMode>-1</a:IconMode>
<a:Rect>((7191,45908), (24311,58492))</a:Rect>
<a:LineColor>16744448</a:LineColor>
<a:FillColor>16770222</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>STRN 0 Arial,8,N
DISPNAME 0 Arial,8,N
CNTR 0 Arial,8,N
Attributes 0 Arial,8,N
ClassPrimaryAttribute 0 Arial,8,U
Operations 0 Arial,8,N
InnerClassifiers 0 Arial,8,N
LABL 0 Arial,8,N</a:FontList>
<a:BrushStyle>6</a:BrushStyle>
<a:GradientFillMode>65</a:GradientFillMode>
<a:GradientEndColor>16777215</a:GradientEndColor>
<c:Object>
<o:Class Ref="o45"/>
</c:Object>
</o:ClassSymbol>
<o:ClassSymbol Id="o8">
<a:CreationDate>1774718282</a:CreationDate>
<a:ModificationDate>1774723429</a:ModificationDate>
<a:IconMode>-1</a:IconMode>
<a:Rect>((-9680,14862), (4582,37186))</a:Rect>
<a:LineColor>16744448</a:LineColor>
<a:FillColor>16770222</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>STRN 0 Arial,8,N
DISPNAME 0 Arial,8,N
CNTR 0 Arial,8,N
Attributes 0 Arial,8,N
ClassPrimaryAttribute 0 Arial,8,U
Operations 0 Arial,8,N
InnerClassifiers 0 Arial,8,N
LABL 0 Arial,8,N</a:FontList>
<a:BrushStyle>6</a:BrushStyle>
<a:GradientFillMode>65</a:GradientFillMode>
<a:GradientEndColor>16777215</a:GradientEndColor>
<c:Object>
<o:Class Ref="o46"/>
</c:Object>
</o:ClassSymbol>
<o:ClassSymbol Id="o7">
<a:CreationDate>1774718283</a:CreationDate>
<a:ModificationDate>1774723836</a:ModificationDate>
<a:IconMode>-1</a:IconMode>
<a:Rect>((-27692,44820), (-15360,58378))</a:Rect>
<a:LineColor>16744448</a:LineColor>
<a:FillColor>16770222</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>STRN 0 Arial,8,N
DISPNAME 0 Arial,8,N
CNTR 0 Arial,8,N
Attributes 0 Arial,8,N
ClassPrimaryAttribute 0 Arial,8,U
Operations 0 Arial,8,N
InnerClassifiers 0 Arial,8,N
LABL 0 Arial,8,N</a:FontList>
<a:BrushStyle>6</a:BrushStyle>
<a:GradientFillMode>65</a:GradientFillMode>
<a:GradientEndColor>16777215</a:GradientEndColor>
<c:Object>
<o:Class Ref="o47"/>
</c:Object>
</o:ClassSymbol>
<o:ClassSymbol Id="o42">
<a:CreationDate>1774718285</a:CreationDate>
<a:ModificationDate>1774723820</a:ModificationDate>
<a:IconMode>-1</a:IconMode>
<a:Rect>((-7844,-10044), (3792,592))</a:Rect>
<a:LineColor>16744448</a:LineColor>
<a:FillColor>16770222</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>STRN 0 Arial,8,N
DISPNAME 0 Arial,8,N
CNTR 0 Arial,8,N
Attributes 0 Arial,8,N
ClassPrimaryAttribute 0 Arial,8,U
Operations 0 Arial,8,N
InnerClassifiers 0 Arial,8,N
LABL 0 Arial,8,N</a:FontList>
<a:BrushStyle>6</a:BrushStyle>
<a:GradientFillMode>65</a:GradientFillMode>
<a:GradientEndColor>16777215</a:GradientEndColor>
<c:Object>
<o:Class Ref="o48"/>
</c:Object>
</o:ClassSymbol>
<o:ClassSymbol Id="o26">
<a:CreationDate>1774718286</a:CreationDate>
<a:ModificationDate>1774723567</a:ModificationDate>
<a:IconMode>-1</a:IconMode>
<a:Rect>((11699,-4716), (22949,11764))</a:Rect>
<a:LineColor>16744448</a:LineColor>
<a:FillColor>16770222</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>STRN 0 Arial,8,N
DISPNAME 0 Arial,8,N
CNTR 0 Arial,8,N
Attributes 0 Arial,8,N
ClassPrimaryAttribute 0 Arial,8,U
Operations 0 Arial,8,N
InnerClassifiers 0 Arial,8,N
LABL 0 Arial,8,N</a:FontList>
<a:BrushStyle>6</a:BrushStyle>
<a:GradientFillMode>65</a:GradientFillMode>
<a:GradientEndColor>16777215</a:GradientEndColor>
<c:Object>
<o:Class Ref="o49"/>
</c:Object>
</o:ClassSymbol>
<o:ClassSymbol Id="o29">
<a:CreationDate>1774718287</a:CreationDate>
<a:ModificationDate>1774723627</a:ModificationDate>
<a:IconMode>-1</a:IconMode>
<a:Rect>((-47003,-6142), (-37299,6442))</a:Rect>
<a:LineColor>16744448</a:LineColor>
<a:FillColor>16770222</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>STRN 0 Arial,8,N
DISPNAME 0 Arial,8,N
CNTR 0 Arial,8,N
Attributes 0 Arial,8,N
ClassPrimaryAttribute 0 Arial,8,U
Operations 0 Arial,8,N
InnerClassifiers 0 Arial,8,N
LABL 0 Arial,8,N</a:FontList>
<a:BrushStyle>6</a:BrushStyle>
<a:GradientFillMode>65</a:GradientFillMode>
<a:GradientEndColor>16777215</a:GradientEndColor>
<c:Object>
<o:Class Ref="o50"/>
</c:Object>
</o:ClassSymbol>
<o:ClassSymbol Id="o32">
<a:CreationDate>1774718289</a:CreationDate>
<a:ModificationDate>1774723889</a:ModificationDate>
<a:IconMode>-1</a:IconMode>
<a:Rect>((-31006,-5132), (-20296,4532))</a:Rect>
<a:LineColor>16744448</a:LineColor>
<a:FillColor>16770222</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>STRN 0 Arial,8,N
DISPNAME 0 Arial,8,N
CNTR 0 Arial,8,N
Attributes 0 Arial,8,N
ClassPrimaryAttribute 0 Arial,8,U
Operations 0 Arial,8,N
InnerClassifiers 0 Arial,8,N
LABL 0 Arial,8,N</a:FontList>
<a:BrushStyle>6</a:BrushStyle>
<a:GradientFillMode>65</a:GradientFillMode>
<a:GradientEndColor>16777215</a:GradientEndColor>
<c:Object>
<o:Class Ref="o51"/>
</c:Object>
</o:ClassSymbol>
<o:ClassSymbol Id="o23">
<a:CreationDate>1774720740</a:CreationDate>
<a:ModificationDate>1774723542</a:ModificationDate>
<a:IconMode>-1</a:IconMode>
<a:Rect>((20717,20595), (33435,34153))</a:Rect>
<a:LineColor>16744448</a:LineColor>
<a:FillColor>16770222</a:FillColor>
<a:ShadowColor>12632256</a:ShadowColor>
<a:FontList>STRN 0 Arial,8,N
DISPNAME 0 Arial,8,N
CNTR 0 Arial,8,N
Attributes 0 Arial,8,N
ClassPrimaryAttribute 0 Arial,8,U
Operations 0 Arial,8,N
InnerClassifiers 0 Arial,8,N
LABL 0 Arial,8,N</a:FontList>
<a:BrushStyle>6</a:BrushStyle>
<a:GradientFillMode>65</a:GradientFillMode>
<a:GradientEndColor>16777215</a:GradientEndColor>
<c:Object>
<o:Class Ref="o52"/>
</c:Object>
</o:ClassSymbol>
</c:Symbols>
</o:ClassDiagram>
</c:ClassDiagrams>
<c:DefaultDiagram>
<o:ClassDiagram Ref="o4"/>
</c:DefaultDiagram>
<c:Classes>
<o:Class Id="o44">
<a:ObjectID>404E5193-9252-4A3D-B1A6-A3A0CE73B2CD</a:ObjectID>
<a:Name>User</a:Name>
<a:Code>User</a:Code>
<a:CreationDate>1774718279</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727604</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:UseParentNamespace>0</a:UseParentNamespace>
<c:Attributes>
<o:Attribute Id="o53">
<a:ObjectID>5E20F83E-2674-44B7-9E63-F887891DFCB1</a:ObjectID>
<a:Name>id_u</a:Name>
<a:Code>id_u</a:Code>
<a:CreationDate>1774719137</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727686</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o54">
<a:ObjectID>BE1207A8-6420-4CB0-9A4E-36B9F468B4D6</a:ObjectID>
<a:Name>email</a:Name>
<a:Code>email</a:Code>
<a:CreationDate>1774719137</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774719480</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o55">
<a:ObjectID>F0FA1011-FC5F-44DD-BD28-231962CD2626</a:ObjectID>
<a:Name>mot_de_passe_hash</a:Name>
<a:Code>mot_de_passe_hash</a:Code>
<a:CreationDate>1774719137</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774719480</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o56">
<a:ObjectID>CC4DC1FA-4B9C-4198-BE1F-BAD271CE256A</a:ObjectID>
<a:Name>nom</a:Name>
<a:Code>nom</a:Code>
<a:CreationDate>1774719137</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774719632</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o57">
<a:ObjectID>55CBFB65-38A1-4282-AE12-701F806FA0CD</a:ObjectID>
<a:Name>prenom</a:Name>
<a:Code>prenom</a:Code>
<a:CreationDate>1774719137</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774719632</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o58">
<a:ObjectID>889035B0-442D-4B1E-829E-30D492C858F8</a:ObjectID>
<a:Name>telephone</a:Name>
<a:Code>telephone</a:Code>
<a:CreationDate>1774719137</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774719632</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
</o:Attribute>
<o:Attribute Id="o59">
<a:ObjectID>92D46D0A-2B73-4A22-9F9F-3C5401C0B480</a:ObjectID>
<a:Name>role</a:Name>
<a:Code>role</a:Code>
<a:CreationDate>1774719137</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774719632</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o60">
<a:ObjectID>747B9F69-0E47-47B5-8C53-D3036C591C38</a:ObjectID>
<a:Name>date_creation</a:Name>
<a:Code>date_creation</a:Code>
<a:CreationDate>1774719137</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774719632</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o61">
<a:ObjectID>E09261B0-41FB-4ED8-991B-14BDEB4B4788</a:ObjectID>
<a:Name>date_derniere_connexion</a:Name>
<a:Code>date_derniere_connexion</a:Code>
<a:CreationDate>1774719137</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774719632</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o62">
<a:ObjectID>F3A221FA-E67A-451E-814F-78AC7945C55D</a:ObjectID>
<a:Name>statut_actif</a:Name>
<a:Code>statut_actif</a:Code>
<a:CreationDate>1774719487</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774719632</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o63">
<a:ObjectID>86AC0EB0-B0D1-4B89-B9DC-DC784C97823F</a:ObjectID>
<a:Name>Attribut_11</a:Name>
<a:Code>email_verifie</a:Code>
<a:CreationDate>1774719487</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774719632</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
</c:Attributes>
<c:Operations>
<o:Operation Id="o64">
<a:ObjectID>8C25E90D-2DC2-4595-BAA9-E8665E406798</a:ObjectID>
<a:Name>register</a:Name>
<a:Code>register</a:Code>
<a:CreationDate>1774719637</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723195</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o65">
<a:ObjectID>2E691FD4-6E3B-45CC-B6F1-B0568F98B8D9</a:ObjectID>
<a:Name>loogin</a:Name>
<a:Code>loogin</a:Code>
<a:CreationDate>1774719637</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723195</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o66">
<a:ObjectID>F428470A-4E27-498A-858F-7840AA562597</a:ObjectID>
<a:Name>verifyEmail</a:Name>
<a:Code>verifyEmail</a:Code>
<a:CreationDate>1774719637</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723195</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o67">
<a:ObjectID>EB90E9CC-BB00-4FFA-A385-AF94B42C82A0</a:ObjectID>
<a:Name>changePassword</a:Name>
<a:Code>changePassword</a:Code>
<a:CreationDate>1774719637</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723195</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o68">
<a:ObjectID>60E15F5A-7774-4858-AE66-A114785EE358</a:ObjectID>
<a:Name>updateProfile</a:Name>
<a:Code>updateProfile</a:Code>
<a:CreationDate>1774719637</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723195</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
</c:Operations>
</o:Class>
<o:Class Id="o45">
<a:ObjectID>79DA0837-3654-4677-87D2-3FE84666A2CC</a:ObjectID>
<a:Name>BiometricsData</a:Name>
<a:Code>BiometricsData</a:Code>
<a:CreationDate>1774718280</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727555</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:UseParentNamespace>0</a:UseParentNamespace>
<c:Attributes>
<o:Attribute Id="o69">
<a:ObjectID>0D434E10-508B-42A2-85E7-51A59ACD1209</a:ObjectID>
<a:Name>id_b</a:Name>
<a:Code>id_b</a:Code>
<a:CreationDate>1774721520</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727674</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o70">
<a:ObjectID>B3DDF9B6-57CF-41FD-A5E0-1C69985D181C</a:ObjectID>
<a:Name>photo_faciale</a:Name>
<a:Code>photo_faciale</a:Code>
<a:CreationDate>1774721520</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721850</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>byte</a:DataType>
</o:Attribute>
<o:Attribute Id="o71">
<a:ObjectID>6C7C9AFB-E1D9-4FD7-8286-58D8CD814F70</a:ObjectID>
<a:Name>donnees_faciale_encodee</a:Name>
<a:Code>donnees_faciale_encodee</a:Code>
<a:CreationDate>1774721520</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721850</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>byte</a:DataType>
</o:Attribute>
<o:Attribute Id="o72">
<a:ObjectID>76956C64-41C9-44E4-BDC3-1409812770DB</a:ObjectID>
<a:Name>score_quality</a:Name>
<a:Code>score_quality</a:Code>
<a:CreationDate>1774721520</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721850</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o73">
<a:ObjectID>1034D325-A1C9-4C1F-81C3-42CC8E1559A5</a:ObjectID>
<a:Name>date_capture</a:Name>
<a:Code>date_capture</a:Code>
<a:CreationDate>1774721520</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721850</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o74">
<a:ObjectID>742FA72A-BC92-4208-9A6F-81280D852CE8</a:ObjectID>
<a:Name>valide</a:Name>
<a:Code>valide</a:Code>
<a:CreationDate>1774721520</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721850</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>boolean</a:DataType>
</o:Attribute>
</c:Attributes>
<c:Operations>
<o:Operation Id="o75">
<a:ObjectID>1DB06AA1-1E02-4AEC-B271-3343B4FE00A7</a:ObjectID>
<a:Name>capture</a:Name>
<a:Code>capture</a:Code>
<a:CreationDate>1774721520</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722951</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o76">
<a:ObjectID>13D89EC8-A945-46A9-9057-D6FC96166FF5</a:ObjectID>
<a:Name>detectLiveness</a:Name>
<a:Code>detectLiveness</a:Code>
<a:CreationDate>1774721520</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722951</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o77">
<a:ObjectID>73E62AF4-5EE4-44EC-A64D-05119BD740F7</a:ObjectID>
<a:Name>compareFaces(reference: BiometricDate)</a:Name>
<a:Code>compareFaces_reference:_BiometricDate_</a:Code>
<a:CreationDate>1774721520</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721850</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o78">
<a:ObjectID>6F3A4BEA-459C-43EC-91D9-25BF094F9E81</a:ObjectID>
<a:Name>getQualityScore</a:Name>
<a:Code>getQualityScore</a:Code>
<a:CreationDate>1774721520</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722951</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
</c:Operations>
</o:Class>
<o:Class Id="o46">
<a:ObjectID>796C19B4-DAD1-4DD2-9C65-40807A67C147</a:ObjectID>
<a:Name>VisaApplication</a:Name>
<a:Code>VisaApplication</a:Code>
<a:CreationDate>1774718282</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727604</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:UseParentNamespace>0</a:UseParentNamespace>
<c:Attributes>
<o:Attribute Id="o79">
<a:ObjectID>5B4787C9-ABCA-4A3F-AF64-EC2742B3AB46</a:ObjectID>
<a:Name>id_v</a:Name>
<a:Code>id_v</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727704</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o80">
<a:ObjectID>B5A69139-7A2D-48A1-8352-654274BEB465</a:ObjectID>
<a:Name>numero_demande</a:Name>
<a:Code>numero_demande</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o81">
<a:ObjectID>EEB18F15-773A-4F93-8803-7AFCB3013461</a:ObjectID>
<a:Name>statut</a:Name>
<a:Code>statut</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o82">
<a:ObjectID>22FCB609-77FE-43B5-A0BA-243A72F5154F</a:ObjectID>
<a:Name>nom</a:Name>
<a:Code>nom</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o83">
<a:ObjectID>F98080B8-80F0-4943-A183-E39AD9469FE2</a:ObjectID>
<a:Name>prenom</a:Name>
<a:Code>prenom</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o84">
<a:ObjectID>BC5FD2F8-828B-430C-9D1B-C1A9A36CDC99</a:ObjectID>
<a:Name>nationalite</a:Name>
<a:Code>nationalite</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o85">
<a:ObjectID>01E8C0BE-6B7C-4AE7-A3CD-4D23B2EB2A56</a:ObjectID>
<a:Name>date_naissance</a:Name>
<a:Code>date_naissance</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o86">
<a:ObjectID>ADE04618-C131-458D-BADB-024B3EB7DCC1</a:ObjectID>
<a:Name>numero_passport</a:Name>
<a:Code>numero_passport</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o87">
<a:ObjectID>AB1E8E82-059E-4883-886C-D9D2AB8D1C89</a:ObjectID>
<a:Name>date_expiration_passport</a:Name>
<a:Code>date_expiration_passport</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o88">
<a:ObjectID>DEA7C2A3-7D3D-4B54-9CEC-992D7C8A8433</a:ObjectID>
<a:Name>motif_voyage</a:Name>
<a:Code>motif_voyage</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o89">
<a:ObjectID>6CC43352-E269-4186-8A29-8BD92E6F29FF</a:ObjectID>
<a:Name>date_prevue_entree</a:Name>
<a:Code>date_prevue_entree</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o90">
<a:ObjectID>9791F2F2-3703-48CD-B673-28F9E9FD0C7A</a:ObjectID>
<a:Name>date_prevue_depart</a:Name>
<a:Code>date_prevue_depart</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o91">
<a:ObjectID>E9D54A64-72F2-489D-A389-0FB8E9DEC392</a:ObjectID>
<a:Name>adresse_cameroun</a:Name>
<a:Code>adresse_cameroun</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o92">
<a:ObjectID>8A730A56-8B05-4858-A0C8-41FFCAA7193F</a:ObjectID>
<a:Name>date_soumission</a:Name>
<a:Code>date_soumission</a:Code>
<a:CreationDate>1774719823</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720364</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o93">
<a:ObjectID>15679DA9-9B23-4504-A81D-D20897D3538A</a:ObjectID>
<a:Name>date_traitement</a:Name>
<a:Code>date_traitement</a:Code>
<a:CreationDate>1774720370</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720499</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
</c:Attributes>
<c:Operations>
<o:Operation Id="o94">
<a:ObjectID>ABD5C565-5057-42E9-BA6C-B2D06C8AB9E5</a:ObjectID>
<a:Name>submit</a:Name>
<a:Code>submit</a:Code>
<a:CreationDate>1774720503</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723222</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o95">
<a:ObjectID>F2F4DC44-DEB0-4FF0-A48F-C6C9BE59D905</a:ObjectID>
<a:Name>save_draft</a:Name>
<a:Code>save_draft</a:Code>
<a:CreationDate>1774720503</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723222</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o96">
<a:ObjectID>0EFEED1E-4752-4EA8-9AD9-75F11DD38AF3</a:ObjectID>
<a:Name>cancel</a:Name>
<a:Code>cancel</a:Code>
<a:CreationDate>1774720503</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723222</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o97">
<a:ObjectID>A8FA5068-854D-4B46-9DE6-DC89327CB47D</a:ObjectID>
<a:Name>gateStatuts</a:Name>
<a:Code>gateStatuts</a:Code>
<a:CreationDate>1774720503</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723222</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o98">
<a:ObjectID>F3556727-D79E-469B-BF90-0BEF927FEE55</a:ObjectID>
<a:Name>approuve(agentId: integer)</a:Name>
<a:Code>approuve_agentId:_integer_</a:Code>
<a:CreationDate>1774720503</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720671</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o99">
<a:ObjectID>62F87A9F-7300-4D2F-9F98-E43B672BA0A5</a:ObjectID>
<a:Name>reject(motif:string)</a:Name>
<a:Code>reject_motif:string_</a:Code>
<a:CreationDate>1774720503</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774720671</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
</c:Operations>
</o:Class>
<o:Class Id="o47">
<a:ObjectID>03F22F4F-7426-43DF-BF97-10B8F21C99D7</a:ObjectID>
<a:Name>Payment</a:Name>
<a:Code>Payment</a:Code>
<a:CreationDate>1774718283</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727078</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:UseParentNamespace>0</a:UseParentNamespace>
<c:Attributes>
<o:Attribute Id="o100">
<a:ObjectID>562EF386-A8D2-4667-B949-CC8FDBA1E92D</a:ObjectID>
<a:Name>id_p</a:Name>
<a:Code>id_p</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727662</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o101">
<a:ObjectID>2805B059-5FE3-4793-9147-35AA93C6AB41</a:ObjectID>
<a:Name>montant</a:Name>
<a:Code>montant</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722137</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
</o:Attribute>
<o:Attribute Id="o102">
<a:ObjectID>17E6BDA5-7F09-46B0-AD9C-A850CA27C051</a:ObjectID>
<a:Name>devise</a:Name>
<a:Code>devise</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722137</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o103">
<a:ObjectID>C86CE9AD-7E3D-4652-BA5D-E769FFC84F6E</a:ObjectID>
<a:Name>methode_paiement</a:Name>
<a:Code>methode_paiement</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722137</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o104">
<a:ObjectID>ECC1228C-4312-4254-A629-868BB8025000</a:ObjectID>
<a:Name>statut</a:Name>
<a:Code>statut</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722137</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o105">
<a:ObjectID>CF7F842F-AC03-49CF-81A3-DD89A994AEF7</a:ObjectID>
<a:Name>transaction_id</a:Name>
<a:Code>transaction_id</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722137</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o106">
<a:ObjectID>EDDA33BE-3854-43BB-9966-C4FF13064730</a:ObjectID>
<a:Name>date_paiement</a:Name>
<a:Code>date_paiement</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722137</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o107">
<a:ObjectID>21294B23-1479-439F-B379-F4ED8D21962A</a:ObjectID>
<a:Name>reference_externe</a:Name>
<a:Code>reference_externe</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722137</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
</c:Attributes>
<c:Operations>
<o:Operation Id="o108">
<a:ObjectID>D32FABB7-6BA6-435B-BD3E-EA1368A0BB9A</a:ObjectID>
<a:Name>precess</a:Name>
<a:Code>precess</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723269</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o109">
<a:ObjectID>4A3DC5CE-A050-45B3-A1C5-7A7A35BEA594</a:ObjectID>
<a:Name>refund</a:Name>
<a:Code>refund</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723269</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o110">
<a:ObjectID>349C3F21-DD01-470B-813C-28F848CB3058</a:ObjectID>
<a:Name>getStatuts</a:Name>
<a:Code>getStatuts</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723269</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o111">
<a:ObjectID>B31A2EBB-DEA6-4240-A47B-861620D18C10</a:ObjectID>
<a:Name>generateReceipt</a:Name>
<a:Code>generateReceipt</a:Code>
<a:CreationDate>1774721878</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723269</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
</c:Operations>
</o:Class>
<o:Class Id="o48">
<a:ObjectID>ED5624AD-1423-43BA-9C55-246FA65AB556</a:ObjectID>
<a:Name>Document</a:Name>
<a:Code>Document</a:Code>
<a:CreationDate>1774718285</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774726850</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:UseParentNamespace>0</a:UseParentNamespace>
<c:Attributes>
<o:Attribute Id="o112">
<a:ObjectID>2D169878-7496-4C1D-B2C1-5064B09F13C0</a:ObjectID>
<a:Name>id_d</a:Name>
<a:Code>id_d</a:Code>
<a:CreationDate>1774721182</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727748</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o113">
<a:ObjectID>232ADEDE-C6F3-4F84-A69E-66920AC3B3E3</a:ObjectID>
<a:Name>type_document</a:Name>
<a:Code>type_document</a:Code>
<a:CreationDate>1774721182</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721428</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o114">
<a:ObjectID>7387921C-6170-4966-AA70-C1C0422C90C4</a:ObjectID>
<a:Name>nom_fichier</a:Name>
<a:Code>nom_fichier</a:Code>
<a:CreationDate>1774721182</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721428</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o115">
<a:ObjectID>A8DA7E45-7DEF-4FB1-943A-978E3E94226C</a:ObjectID>
<a:Name>chemin_fichier</a:Name>
<a:Code>chemin_fichier</a:Code>
<a:CreationDate>1774721182</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721428</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o116">
<a:ObjectID>9B8E094D-0193-40A4-8D68-6D2CAFA16110</a:ObjectID>
<a:Name>taille</a:Name>
<a:Code>taille</a:Code>
<a:CreationDate>1774721182</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721428</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o117">
<a:ObjectID>633CCAD6-0E9E-491B-8C6E-FF545ED10F25</a:ObjectID>
<a:Name>date_upload</a:Name>
<a:Code>date_upload</a:Code>
<a:CreationDate>1774721182</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721428</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o118">
<a:ObjectID>131A6C4D-DE66-44A5-9F04-DABC499683CA</a:ObjectID>
<a:Name>valide</a:Name>
<a:Code>valide</a:Code>
<a:CreationDate>1774721182</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721428</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>boolean</a:DataType>
</o:Attribute>
</c:Attributes>
<c:Operations>
<o:Operation Id="o119">
<a:ObjectID>4B3E81EB-1A9F-485B-9C0C-877DB12BA8E5</a:ObjectID>
<a:Name>upload</a:Name>
<a:Code>upload</a:Code>
<a:CreationDate>1774721182</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723242</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o120">
<a:ObjectID>C5C003BF-E861-418A-9E7D-037B24E83FD7</a:ObjectID>
<a:Name>validate</a:Name>
<a:Code>validate</a:Code>
<a:CreationDate>1774721182</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723242</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
</c:Operations>
</o:Class>
<o:Class Id="o49">
<a:ObjectID>E1D504E7-3A4A-4D68-9E04-976DDDA3A034</a:ObjectID>
<a:Name>Evisa</a:Name>
<a:Code>Evisa</a:Code>
<a:CreationDate>1774718286</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774725218</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:UseParentNamespace>0</a:UseParentNamespace>
<c:Attributes>
<o:Attribute Id="o121">
<a:ObjectID>18FB8975-C3DD-45AC-BDFF-70C5E97B6466</a:ObjectID>
<a:Name>id_evi</a:Name>
<a:Code>id_evi</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727735</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o122">
<a:ObjectID>1B9E3907-2A74-4B67-9418-BEE43648E885</a:ObjectID>
<a:Name>numero_visa</a:Name>
<a:Code>numero_visa</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722623</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o123">
<a:ObjectID>8B1ED6B5-E653-407B-BE10-F4D9082EA598</a:ObjectID>
<a:Name>date_emission</a:Name>
<a:Code>date_emission</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722623</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o124">
<a:ObjectID>C92D6BA5-984C-4DD4-A104-632FA51BFC69</a:ObjectID>
<a:Name>date_expiration</a:Name>
<a:Code>date_expiration</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722623</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o125">
<a:ObjectID>E9B8D631-F457-443A-9BAD-E7292C9C0BB3</a:ObjectID>
<a:Name>qr-code</a:Name>
<a:Code>qr_code</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722623</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>byte</a:DataType>
</o:Attribute>
<o:Attribute Id="o126">
<a:ObjectID>A886D6CA-2A68-489F-9753-EB807400D0A2</a:ObjectID>
<a:Name>fichier_pdf</a:Name>
<a:Code>fichier_pdf</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722623</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o127">
<a:ObjectID>E485DCC3-62A6-4F7A-B28A-8727A1A08765</a:ObjectID>
<a:Name>revoque</a:Name>
<a:Code>revoque</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722623</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o128">
<a:ObjectID>83C6B5F3-A60E-48AC-9B85-D5EAE6D39030</a:ObjectID>
<a:Name>date_revocation</a:Name>
<a:Code>date_revocation</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722623</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o129">
<a:ObjectID>20B0BED8-B50D-4DBF-8CC1-3955DBE955BE</a:ObjectID>
<a:Name>motif_revocation</a:Name>
<a:Code>motif_revocation</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722623</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
</c:Attributes>
<c:Operations>
<o:Operation Id="o130">
<a:ObjectID>F376D6F3-34F5-4891-8E80-358AF812D149</a:ObjectID>
<a:Name>generate</a:Name>
<a:Code>generate</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723307</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o131">
<a:ObjectID>9B6EBDCB-6CEA-46D7-A97D-B69FF2E77F1A</a:ObjectID>
<a:Name>generateQrCode</a:Name>
<a:Code>generateQrCode</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723307</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o132">
<a:ObjectID>0885684E-A812-4112-956F-DFAE94D1B825</a:ObjectID>
<a:Name>generatePDF</a:Name>
<a:Code>generatePDF</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723307</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o133">
<a:ObjectID>634CD0C9-39F6-4B70-97D9-946ADC8163AD</a:ObjectID>
<a:Name>verify(Qrcode:string)</a:Name>
<a:Code>verify_Qrcode:string_</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722623</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o134">
<a:ObjectID>87B33985-B5CB-4DE6-BE3D-9934D6846111</a:ObjectID>
<a:Name>revoke(motif:string)</a:Name>
<a:Code>revoke_motif:string_</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722623</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o135">
<a:ObjectID>8AC19859-F163-430D-A1EB-A529ECA1589C</a:ObjectID>
<a:Name>download</a:Name>
<a:Code>download</a:Code>
<a:CreationDate>1774722171</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723307</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
</c:Operations>
</o:Class>
<o:Class Id="o50">
<a:ObjectID>5144759F-6CC3-4DE8-B310-CC4AD05E025E</a:ObjectID>
<a:Name>Notification</a:Name>
<a:Code>Notification</a:Code>
<a:CreationDate>1774718287</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774725297</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:UseParentNamespace>0</a:UseParentNamespace>
<c:Attributes>
<o:Attribute Id="o136">
<a:ObjectID>C429C59D-BE6A-4A74-B91F-113BB0BD97D4</a:ObjectID>
<a:Name>id_N</a:Name>
<a:Code>id_N</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727774</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o137">
<a:ObjectID>0E763F00-2731-46EB-A147-EFD2FDDA9645</a:ObjectID>
<a:Name>type</a:Name>
<a:Code>type</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722888</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o138">
<a:ObjectID>2B286E2B-A5C6-4683-9E1C-074A8E0DABFD</a:ObjectID>
<a:Name>sujet</a:Name>
<a:Code>sujet</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722888</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o139">
<a:ObjectID>70E2BFAB-190B-4F34-8BE4-66DA9D42AD28</a:ObjectID>
<a:Name>message</a:Name>
<a:Code>message</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722888</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o140">
<a:ObjectID>D1490807-ECC8-4BEF-AC65-BB632A2475F3</a:ObjectID>
<a:Name>statut</a:Name>
<a:Code>statut</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722888</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o141">
<a:ObjectID>A7D57EDE-1D9D-43D7-A173-09407BCDD275</a:ObjectID>
<a:Name>date_denvoi</a:Name>
<a:Code>date_denvoi</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722888</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o142">
<a:ObjectID>278C8527-D5A6-4CD9-BFAE-8E06CCD0DE08</a:ObjectID>
<a:Name>date_lecture</a:Name>
<a:Code>date_lecture</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722888</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o143">
<a:ObjectID>3EC3086E-733D-475B-A978-FB4B1B8631B5</a:ObjectID>
<a:Name>tentatives</a:Name>
<a:Code>tentatives</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722888</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
</c:Attributes>
<c:Operations>
<o:Operation Id="o144">
<a:ObjectID>AFDAA104-B181-444C-99D6-0C553055084C</a:ObjectID>
<a:Name>send</a:Name>
<a:Code>send</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723329</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o145">
<a:ObjectID>CF4038B5-C0B4-48A2-84CE-3120227F98B4</a:ObjectID>
<a:Name>markAsRead</a:Name>
<a:Code>markAsRead</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723329</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o146">
<a:ObjectID>CA1FF951-6AE1-46FA-AEF8-054BFC69331F</a:ObjectID>
<a:Name>retry</a:Name>
<a:Code>retry</a:Code>
<a:CreationDate>1774722662</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723329</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
</c:Operations>
</o:Class>
<o:Class Id="o51">
<a:ObjectID>98506F83-7C81-4A55-AF80-23AEAEAE7FA3</a:ObjectID>
<a:Name>AuditLog</a:Name>
<a:Code>AuditLog</a:Code>
<a:CreationDate>1774718289</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774726527</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:UseParentNamespace>0</a:UseParentNamespace>
<c:Attributes>
<o:Attribute Id="o147">
<a:ObjectID>2CD97493-428E-4A96-B1C7-EF9273CBF79D</a:ObjectID>
<a:Name>id_A</a:Name>
<a:Code>id_A</a:Code>
<a:CreationDate>1774722969</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727761</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o148">
<a:ObjectID>6DA36D7D-A706-4A9C-9500-690AA81345D7</a:ObjectID>
<a:Name>action</a:Name>
<a:Code>action</a:Code>
<a:CreationDate>1774722969</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723153</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o149">
<a:ObjectID>DFDC9EB2-2D3C-45B4-BE31-1F83B2BA3799</a:ObjectID>
<a:Name>description</a:Name>
<a:Code>description</a:Code>
<a:CreationDate>1774722969</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723153</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o150">
<a:ObjectID>15050536-4A18-4059-89B7-201CD8F5D58D</a:ObjectID>
<a:Name>donnees_avant</a:Name>
<a:Code>donnees_avant</a:Code>
<a:CreationDate>1774722969</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723153</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o151">
<a:ObjectID>E8CDAF76-F38B-4D09-B9D4-DCEF3A8F1645</a:ObjectID>
<a:Name>donnees_apres</a:Name>
<a:Code>donnees_apres</a:Code>
<a:CreationDate>1774722969</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723153</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o152">
<a:ObjectID>31B42E1D-0DF4-4594-ADEE-0CA3B59F5CEB</a:ObjectID>
<a:Name>date_action</a:Name>
<a:Code>date_action</a:Code>
<a:CreationDate>1774722969</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723153</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>Date</a:DataType>
</o:Attribute>
<o:Attribute Id="o153">
<a:ObjectID>1DA7380F-EACA-437D-9A9F-363D3BCAF9E2</a:ObjectID>
<a:Name>ip_address</a:Name>
<a:Code>ip_address</a:Code>
<a:CreationDate>1774722969</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774723153</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
</c:Attributes>
</o:Class>
<o:Class Id="o52">
<a:ObjectID>0671884F-1E6F-4C86-A1BC-34E40B4B00A7</a:ObjectID>
<a:Name>VisaType</a:Name>
<a:Code>VisaType</a:Code>
<a:CreationDate>1774720740</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774724796</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:UseParentNamespace>0</a:UseParentNamespace>
<c:Attributes>
<o:Attribute Id="o154">
<a:ObjectID>9F9E72BD-2E6F-4D7C-99A0-1DE2E8E2D471</a:ObjectID>
<a:Name>id_vi</a:Name>
<a:Code>id_vi</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727718</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
<a:Attribute.Visibility>-</a:Attribute.Visibility>
</o:Attribute>
<o:Attribute Id="o155">
<a:ObjectID>93F65502-9785-4684-8813-74188E09AA91</a:ObjectID>
<a:Name>nom</a:Name>
<a:Code>nom</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721089</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o156">
<a:ObjectID>25A78EAC-57ED-4A39-9C1D-D781C9E2E4EE</a:ObjectID>
<a:Name>code</a:Name>
<a:Code>code</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721175</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o157">
<a:ObjectID>D59D20BE-869D-4131-8722-93611D300F25</a:ObjectID>
<a:Name>description</a:Name>
<a:Code>description</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721175</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o158">
<a:ObjectID>6C74F7E2-CCB9-4E0B-BBFD-3E0141E9ECEF</a:ObjectID>
<a:Name>duree_validite</a:Name>
<a:Code>duree_validite</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721175</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o159">
<a:ObjectID>D4CD5AB3-B2B3-47C9-A98B-67C84DF1CE63</a:ObjectID>
<a:Name>duree_sejour_max</a:Name>
<a:Code>duree_sejour_max</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721175</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o160">
<a:ObjectID>9390DD8D-2282-4337-8C62-31BC21801E08</a:ObjectID>
<a:Name>tarif</a:Name>
<a:Code>tarif</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721175</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>int</a:DataType>
</o:Attribute>
<o:Attribute Id="o161">
<a:ObjectID>88724CF3-225A-4D90-B084-18B741146ABA</a:ObjectID>
<a:Name>document_requis</a:Name>
<a:Code>document_requis</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721175</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>byte</a:DataType>
</o:Attribute>
<o:Attribute Id="o162">
<a:ObjectID>605CA195-E0D3-403B-96A8-87806AF18EA2</a:ObjectID>
<a:Name>delai_traitement</a:Name>
<a:Code>delai_traitement</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721175</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>String</a:DataType>
</o:Attribute>
<o:Attribute Id="o163">
<a:ObjectID>14301292-9590-45DC-B731-43F4329B13BC</a:ObjectID>
<a:Name>actif</a:Name>
<a:Code>actif</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774721175</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:DataType>boolean</a:DataType>
</o:Attribute>
</c:Attributes>
<c:Operations>
<o:Operation Id="o164">
<a:ObjectID>0F717713-C0BE-4358-9731-230517CCBE90</a:ObjectID>
<a:Name>getRquiredDocuments</a:Name>
<a:Code>getRquiredDocuments</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722921</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
<o:Operation Id="o165">
<a:ObjectID>E464B22D-AC45-4262-9286-3B1F1FF36506</a:ObjectID>
<a:Name>calculateFees</a:Name>
<a:Code>calculateFees</a:Code>
<a:CreationDate>1774720745</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774722921</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TemplateBody>%DefaultBody%</a:TemplateBody>
</o:Operation>
</c:Operations>
</o:Class>
</c:Classes>
<c:Associations>
<o:Association Id="o21">
<a:ObjectID>500E5923-0BAD-4737-AE97-F84589489BE2</a:ObjectID>
<a:Name>Association_1</a:Name>
<a:Code>Association_1</a:Code>
<a:CreationDate>1774723441</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774724266</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:RoleAMultiplicity>1..1</a:RoleAMultiplicity>
<a:RoleBMultiplicity>1..*</a:RoleBMultiplicity>
<c:Object1>
<o:Class Ref="o46"/>
</c:Object1>
<c:Object2>
<o:Class Ref="o44"/>
</c:Object2>
</o:Association>
<o:Association Id="o24">
<a:ObjectID>3A13AF1B-C9D1-4BAE-977C-2B82A9D3AB57</a:ObjectID>
<a:Name>Association_2</a:Name>
<a:Code>Association_2</a:Code>
<a:CreationDate>1774723533</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774724796</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:RoleAMultiplicity>0..*</a:RoleAMultiplicity>
<a:RoleBMultiplicity>1..1</a:RoleBMultiplicity>
<c:Object1>
<o:Class Ref="o52"/>
</c:Object1>
<c:Object2>
<o:Class Ref="o46"/>
</c:Object2>
</o:Association>
<o:Association Id="o27">
<a:ObjectID>682B0B70-F6D5-4952-9E8B-37CA18F57B7B</a:ObjectID>
<a:Name>Association_3</a:Name>
<a:Code>Association_3</a:Code>
<a:CreationDate>1774723571</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774725218</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:RoleAMultiplicity>1..1</a:RoleAMultiplicity>
<a:RoleBMultiplicity>1..1</a:RoleBMultiplicity>
<c:Object1>
<o:Class Ref="o49"/>
</c:Object1>
<c:Object2>
<o:Class Ref="o46"/>
</c:Object2>
</o:Association>
<o:Association Id="o30">
<a:ObjectID>1B073D04-EB35-4440-BDC9-3BD0C8B80EF1</a:ObjectID>
<a:Name>Association_4</a:Name>
<a:Code>Association_4</a:Code>
<a:CreationDate>1774723608</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774725297</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:RoleAMultiplicity>1..1</a:RoleAMultiplicity>
<a:RoleBMultiplicity>1..*</a:RoleBMultiplicity>
<c:Object1>
<o:Class Ref="o50"/>
</c:Object1>
<c:Object2>
<o:Class Ref="o44"/>
</c:Object2>
</o:Association>
<o:Association Id="o33">
<a:ObjectID>1EF7FB11-378B-4ED4-83F2-1096BF78637E</a:ObjectID>
<a:Name>Association_5</a:Name>
<a:Code>Association_5</a:Code>
<a:CreationDate>1774723634</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774726527</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:RoleAMultiplicity>1..1</a:RoleAMultiplicity>
<a:RoleBMultiplicity>1..*</a:RoleBMultiplicity>
<c:Object1>
<o:Class Ref="o51"/>
</c:Object1>
<c:Object2>
<o:Class Ref="o44"/>
</c:Object2>
</o:Association>
<o:Association Id="o35">
<a:ObjectID>860BA1C5-CFC5-4C67-BAF5-613B52C3D53B</a:ObjectID>
<a:Name>Association_6</a:Name>
<a:Code>Association_6</a:Code>
<a:CreationDate>1774723683</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727604</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:RoleAMultiplicity>1..*</a:RoleAMultiplicity>
<a:RoleBMultiplicity>1..*</a:RoleBMultiplicity>
<c:Object1>
<o:Class Ref="o46"/>
</c:Object1>
<c:Object2>
<o:Class Ref="o44"/>
</c:Object2>
</o:Association>
<o:Association Id="o37">
<a:ObjectID>8692D9A8-81AC-4E26-934E-AFDD4D28D7F7</a:ObjectID>
<a:Name>Association_7</a:Name>
<a:Code>Association_7</a:Code>
<a:CreationDate>1774723846</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774726936</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:RoleAMultiplicity>1..1</a:RoleAMultiplicity>
<a:RoleBMultiplicity>1..1</a:RoleBMultiplicity>
<c:Object1>
<o:Class Ref="o47"/>
</c:Object1>
<c:Object2>
<o:Class Ref="o44"/>
</c:Object2>
</o:Association>
<o:Association Id="o40">
<a:ObjectID>E1BF7A18-C528-4EC5-8172-5F17D6844F41</a:ObjectID>
<a:Name>Association_8</a:Name>
<a:Code>Association_8</a:Code>
<a:CreationDate>1774723854</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727555</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:RoleAMultiplicity>1..1</a:RoleAMultiplicity>
<a:RoleBMultiplicity>1..1</a:RoleBMultiplicity>
<c:Object1>
<o:Class Ref="o45"/>
</c:Object1>
<c:Object2>
<o:Class Ref="o46"/>
</c:Object2>
</o:Association>
<o:Association Id="o43">
<a:ObjectID>192E2A92-86F0-4ACD-A313-C786F3AD8987</a:ObjectID>
<a:Name>Association_9</a:Name>
<a:Code>Association_9</a:Code>
<a:CreationDate>1774723863</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774726850</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:RoleAMultiplicity>1..1</a:RoleAMultiplicity>
<a:RoleBMultiplicity>1..*</a:RoleBMultiplicity>
<c:Object1>
<o:Class Ref="o48"/>
</c:Object1>
<c:Object2>
<o:Class Ref="o46"/>
</c:Object2>
</o:Association>
<o:Association Id="o9">
<a:ObjectID>0CE022BC-90C3-46F5-8008-D04225370CED</a:ObjectID>
<a:Name>Association_10</a:Name>
<a:Code>Association_10</a:Code>
<a:CreationDate>1774726968</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774727078</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:RoleAMultiplicity>1..*</a:RoleAMultiplicity>
<a:RoleBMultiplicity>1..1</a:RoleBMultiplicity>
<c:Object1>
<o:Class Ref="o46"/>
</c:Object1>
<c:Object2>
<o:Class Ref="o47"/>
</c:Object2>
</o:Association>
</c:Associations>
<c:TargetModels>
<o:TargetModel Id="o166">
<a:ObjectID>6CF08223-5916-44FF-8D55-DAC704272F2A</a:ObjectID>
<a:Name>Analyse</a:Name>
<a:Code>Analysis</a:Code>
<a:CreationDate>1774708091</a:CreationDate>
<a:Creator>AWD</a:Creator>
<a:ModificationDate>1774708091</a:ModificationDate>
<a:Modifier>AWD</a:Modifier>
<a:TargetModelURL>file:///%_OBJLANG%/analysis.xol</a:TargetModelURL>
<a:TargetModelID>87317290-AF03-469F-BC1E-99593F18A4AB</a:TargetModelID>
<a:TargetModelClassID>1811206C-1A4B-11D1-83D9-444553540000</a:TargetModelClassID>
<c:SessionShortcuts>
<o:Shortcut Ref="o3"/>
</c:SessionShortcuts>
</o:TargetModel>
</c:TargetModels>
</o:Model>
</c:Children>
</o:RootObject>

</Model>